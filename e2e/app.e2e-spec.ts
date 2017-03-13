import { AnticafeWebAngularPage } from './app.po';

describe('anticafe-web-angular App', () => {
  let page: AnticafeWebAngularPage;

  beforeEach(() => {
    page = new AnticafeWebAngularPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
