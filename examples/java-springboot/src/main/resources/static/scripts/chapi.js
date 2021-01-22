const MEDIATOR = 'https://authn.theosirian.com/mediator' + '?origin=' + encodeURIComponent(window.location.origin);

$(document).ready(async function() {
  const polyfill = window.credentialHandlerPolyfill;

  await polyfill.loadOnce(MEDIATOR);

  $('#chapi-sign-in').on('click', async function (event) {
    event.preventDefault();

    const credentialQuery = {
      web: {
        VerifiablePresentation: {
          query: {
            type: 'QueryByExample',
            credentialQuery: {
              reason: "Login to Demo App"
            }
          }
        }
      }
    };

    const webCredential = await navigator.credentials.get(credentialQuery);
    if (!webCredential) return;

    if (webCredential.type !== 'web') {
      return alert('Invalid web credential type')
    }

    if (webCredential.dataType !== 'VerifiablePresentation') {
      return alert('Invalid web credential data type')
    }

    const vp = webCredential.data

    console.log('VP', vp)
    // TODO: post VP to server and redirect
  });

  $('#chapi-store').on('click', async function (event) {
    event.preventDefault();

    const vc = JSON.parse(document.getElementById('credential').value);
    // https://github.com/digitalbazaar/credential-handler-polyfill#webcredential
    const presentation = {
      "@context": "https://www.w3.org/2018/credentials/v1",
      "type": "VerifiablePresentation",
      "verifiableCredential": [vc]
    };
    const webCredential = new WebCredential('VerifiablePresentation', presentation);
    const result = await navigator.credentials.store(webCredential);
    console.log(result);
  });
});
