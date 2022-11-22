const { Logger } = require('@hocuspocus/extension-logger');
const { Server } = require('@hocuspocus/server');
const { slateNodesToInsertDelta } = require('@slate-yjs/core');
const Y = require('yjs');

const initialValue = [{ type: 'paragraph', children: [{ text: 'Demo' }] }];

// Setup the server
const server = Server.configure({
  port: Number(process.env.PORT || 4000),

  // Add logging
  extensions: [new Logger()],

  async onLoadDocument(data) {
    // Load the initial value in case the document is empty
    if (data.document.isEmpty('content')) {
      const insertDelta = slateNodesToInsertDelta(initialValue);
      const sharedRoot = data.document.get('content', Y.XmlText);
      // @ts-ignore
      sharedRoot.applyDelta(insertDelta);
    }

    return data.document;
  },
});

// Start the server
server.enableMessageLogging();
server.listen();
