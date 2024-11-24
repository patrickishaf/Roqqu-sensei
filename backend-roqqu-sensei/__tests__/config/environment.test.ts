import {getConfig} from "../../src/config/environments";

describe('getConfig', () => {
  it('should load the variables in the test environment', async () => {
    const config = getConfig();
    expect(config).toBeDefined();
  });

  it('should load the right variables', async () => {
    const config = getConfig();
    expect(config.dbUrl).toBeDefined();
    expect(config.port).toBeDefined();
  });
});