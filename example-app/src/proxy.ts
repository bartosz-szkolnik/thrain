import { Proxy } from '@thrain/core/proxy.ts';
import { Encoder } from '@thrain/common/encoder.ts';

// createSimpleProxy('localhost', 8081, { 'X-Custom-Header': 'Just a stupid value' });

const proxy = new Proxy({ host: 'localhost', port: 8081 }, { host: 'localhost', port: 8080 });
proxy.addHeader('X-Custom-Header', 'Just a stupid value');
proxy.addHeader('X-Custom-Header-2', Encoder.toBase64('Just a stupid value'));
proxy.start();
