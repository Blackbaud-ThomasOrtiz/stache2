import { expect } from '@blackbaud/skyux-builder/runtime/testing/browser';

import { StacheFooterModule } from './footer.module';

describe('StacheFooterModule', () => {
  it('should export', () => {
    const exportedModule = new StacheFooterModule();
    expect(exportedModule).toBeDefined();
  });
});
