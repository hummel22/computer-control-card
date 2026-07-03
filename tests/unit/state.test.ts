import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { deriveComputerState } from '../../src/state';

const thresholds = {
  idleWatts: 10,
  activeWatts: 40,
};

describe('deriveComputerState', () => {
  it('derives outlet_off when the outlet is off', () => {
    assert.equal(
      deriveComputerState({ outletState: 'off', statusState: 'on', powerWatts: 100, thresholds }),
      'outlet_off',
    );
  });

  it('derives online when the outlet and status are on', () => {
    assert.equal(deriveComputerState({ outletState: 'on', statusState: 'on', powerWatts: 5, thresholds }), 'online');
  });

  it('derives offline_standby when outlet is on, status is off, and watts are below idle threshold', () => {
    assert.equal(
      deriveComputerState({ outletState: 'on', statusState: 'off', powerWatts: 9.9, thresholds }),
      'offline_standby',
    );
  });

  it('derives booting_or_service_unavailable when outlet is on, status is off, and watts are above active threshold', () => {
    assert.equal(
      deriveComputerState({ outletState: 'on', statusState: 'off', powerWatts: 40.1, thresholds }),
      'booting_or_service_unavailable',
    );
  });

  it('returns unknown when status is off and power is between thresholds', () => {
    assert.equal(deriveComputerState({ outletState: 'on', statusState: 'off', powerWatts: 20, thresholds }), 'unknown');
  });

  it('returns unknown when outlet or status entities are missing or unavailable', () => {
    assert.equal(deriveComputerState({ outletState: undefined, statusState: 'on', powerWatts: 20, thresholds }), 'unknown');
    assert.equal(deriveComputerState({ outletState: 'unavailable', statusState: 'on', powerWatts: 20, thresholds }), 'unknown');
    assert.equal(deriveComputerState({ outletState: 'on', statusState: undefined, powerWatts: 20, thresholds }), 'unknown');
    assert.equal(deriveComputerState({ outletState: 'on', statusState: 'unavailable', powerWatts: 20, thresholds }), 'unknown');
  });

  it('returns unknown when required power or threshold inputs are missing or invalid', () => {
    assert.equal(deriveComputerState({ outletState: 'on', statusState: 'off', powerWatts: undefined, thresholds }), 'unknown');
    assert.equal(
      deriveComputerState({ outletState: 'on', statusState: 'off', powerWatts: Number.NaN, thresholds }),
      'unknown',
    );
    assert.equal(
      deriveComputerState({
        outletState: 'on',
        statusState: 'off',
        powerWatts: 20,
        thresholds: { idleWatts: Number.NaN, activeWatts: 40 },
      }),
      'unknown',
    );
  });

  it('accepts numeric strings and normalizes state casing and whitespace', () => {
    assert.equal(
      deriveComputerState({ outletState: ' ON ', statusState: ' OFF ', powerWatts: '5', thresholds }),
      'offline_standby',
    );
  });
});
