import React, { PropTypes } from 'react';
import ReactDOMServer from 'react-dom/server';

import { BUNDLE_PATH } from '../config';
import fonts from '../assets/fonts';

const Application = ({ bundle }) => {
  const includeFont = (fontSource) => (
    <link key={fontSource} href={fontSource} rel='stylesheet' type='text/css'/>
  );

  return (
    <html lang='en'>
      <head>
        {fonts.map(includeFont)}
      </head>
      <body>
        <div>
          Nothing to see here...
        </div>
      </body>
    </html>
  );
};

const applicationView = ReactDOMServer.renderToStaticMarkup(
  <Application/>
);

export default applicationView;
