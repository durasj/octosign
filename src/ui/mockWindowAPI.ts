const dssBackend = {
  available: 'PKCS 11 DLL not found',
  config: {
    author: 'Jakub Ďuraš <jakub@duras.me>',
    build: 'bash -e ./dist.sh',
    description:
      'Advanced electronic signature usable on PDF and other documents using cryptography. Requires an usable certificate and signing drivers (for example ID cards and readers of EU citizens). Uses Digital Signature Service from European Commission licensed under the LGPL-2.1.',
    exec: './jdk/bin/java -jar ./sign.jar',
    license: 'GNU Lesser General Public License v2.1',
    name: 'Advanced electronic signature',
    repository: 'https://github.com/durasj/octosign-dss',
    version: '0.1.0',
  },
  slug: 'dss',
};

const imageBackend = {
  available: true,
  config: {
    author: 'Jakub Ďuraš <jakub@duras.me>',
    build: 'bash -e ./build.sh',
    description:
      'Signs PDFs using chosen image or drawn signature. Based on the unipdf library from FoxyUtils ehf licensed under the AGPLv3.',
    exec: './main',
    license: 'GNU Affero General Public License v3.0',
    name: 'Simple image signature',
    repository: 'https://github.com/durasj/octosign-image',
    version: '0.1.0',
  },
  slug: 'image',
};

const mockWindowAPI = (window: Window) => {
  window.OctoSign = {
    list: () => Promise.resolve([dssBackend, imageBackend]),
    set: () => Promise.resolve(),
    meta: () => Promise.resolve(),
    sign: () => Promise.resolve(),
    verify: () => Promise.resolve(),
  };

  window.apiReady = Promise.resolve();
  window.showWindow = () => undefined;
};

export default mockWindowAPI;
