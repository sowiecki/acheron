import React from 'react';
import ReactDOMServer from 'react-dom/server';

import fonts from '../assets/fonts';

const Application = () => {
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

const applicationView = ReactDOMServer.renderToStaticMarkup(<Application/>);

export default applicationView;
