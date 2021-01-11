const addCredentialBtn = document.getElementById('add-credential-btn');
const polyfill = window.credentialHandlerPolyfill;

addCredentialBtn.disabled = true
polyfill.loadOnce().then(function () {
	addCredentialBtn.disabled = false
}, function (err) {
});

addCredentialBtn.addEventListener('click', async function (e) {
	const vc = JSON.parse(document.getElementById('credential').value);
	// https://github.com/digitalbazaar/credential-handler-polyfill#webcredential
	const presentation = {
		"@context": "https://www.w3.org/2018/credentials/v1",
		"type": "VerifiablePresentation",
		"verifiableCredential": [vc]
	};
	const polyfill = window.credentialHandlerPolyfill;
	const webCredential = new WebCredential('VerifiablePresentation', presentation);
	const result = await navigator.credentials.store(webCredential);
	console.log(result)
}, false);
