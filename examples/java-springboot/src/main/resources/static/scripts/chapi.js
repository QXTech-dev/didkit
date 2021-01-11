const polyfill = window.credentialHandlerPolyfill;

$('#chapi-sign-in').on('click', async function (event) {
    event.preventDefault();
    await polyfill.loadOnce();
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
    if (!webCredential) return
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
