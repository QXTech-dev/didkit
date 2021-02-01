const test = (title, fn) => {
  try {
    fn();
    console.log(`[    ok: ${title}]`);
  } catch (e) {
    console.error(`[fail: ${title}]`, e);
  }
};

DIDKitLoader.loadDIDKit("/didkit_wasm_bg.wasm").then(
  async ({
    getVersion,
    generateEd25519Key,
    keyToDID,
    keyToVerificationMethod,
    issueCredential,
    verifyCredential,
    issuePresentation,
    verifyPresentation,
  }) => {
    const emptyObj = JSON.stringify({});

    test("should get library version", () => {
      const version = getVersion();
      if (typeof version !== "string") throw "version is not an string";
    });

    test("should generate ed25519 key", () => {
      const k = JSON.parse(generateEd25519Key());

      if (!("kty" in k)) throw "missing 'kty' prop";
      if (!("crv" in k)) throw "missing 'kty' prop";
      if (!("x" in k)) throw "missing 'kty' prop";
      if (!("d" in k)) throw "missing 'kty' prop";

      if (k.kty !== "OKP") throw "expected 'OKP' in 'kty'";
      if (k.crv !== "Ed25519") throw "expected 'Ed25519 in 'kty'";
    });

    const key = {
      kty: "OKP",
      crv: "Ed25519",
      x: "PBcY2yJ4h_cLUnQNcYhplu9KQQBNpGxP4sYcMPdlu6I",
      d: "n5WUFIghmRYZi0rEYo2lz-Zg2B9B1KW4MYfJXwOXfyI",
    };

    const keyStr = JSON.stringify(key);

    test("should produce did", () => {
      const expect = "did:key:z6MkiVpwA241guqtKWAkohHpcAry7S94QQb6ukW3GcCsugbK";
      const did = keyToDID("key", keyStr);
      if (did !== expect) throw `expected '${expect}'`;
    });

    test("should produce verificationMethod", async () => {
      const expect =
        "did:key:z6MkiVpwA241guqtKWAkohHpcAry7S94QQb6ukW3GcCsugbK#z6MkiVpwA241guqtKWAkohHpcAry7S94QQb6ukW3GcCsugbK";
      const vm = await keyToVerificationMethod("key", keyStr);
      if (vm !== expect) throw `expected '${expect}'`;
    });

    const did = keyToDID("key", keyStr);
    const verificationMethod = await keyToVerificationMethod("key", keyStr);

    const other = {
      key: generateEd25519Key(),
      keyStr: JSON.stringify(otherKey),
      did: keyToDID("key", otherKeyStr),
      verificationMethod: keyToVerificationMethod("key", otherKeyStr),
    };

    test("should fail if parameters are empty objects", async () => {
      try {
        await issueCredential(emptyObj, emptyObj, emptyObj);
        throw "did not fail";
      } catch (e) {}
    });

    test("should verify issued credential", async () => {
      const credential = await issueCredential(
        JSON.stringify({
          "@context": "https://www.w3.org/2018/credentials/v1",
          id: "http://example.org/credentials/3731",
          type: ["VerifiableCredential"],
          issuer: did,
          issuanceDate: "2020-08-19T21:41:50Z",
          credentialSubject: {
            id: other.did,
          },
        }),
        JSON.stringify({
          proofPurpose: "assertionMethod",
          verificationMethod: verificationMethod,
        }),
        keyStr
      );

      const verifyStr = await verifyCredential(
        credential,
        JSON.stringify({
          proofPurpose: "assertionMethod",
        })
      );

      const verify = JSON.parse(verifyStr);

      if (verify.errors.length > 0) throw verify.errors;
    });

    test("should fail if parameters are empty objects", async () => {
      try {
        await issuePresentation(emptyObj, emptyObj, emptyObj);
        throw "did not fail";
      } catch (e) {}
    });

    test("should verify issued presentation", async () => {
      const credential = await issueCredential(
        JSON.stringify({
          "@context": "https://www.w3.org/2018/credentials/v1",
          id: "http://example.org/credentials/3731",
          type: ["VerifiableCredential"],
          issuer: did,
          issuanceDate: "2020-08-19T21:41:50Z",
          credentialSubject: {
            id: other.did,
          },
        }),
        JSON.stringify({
          proofPurpose: "assertionMethod",
          verificationMethod: verificationMethod,
        }),
        keyStr
      );

      const presentation = await issuePresentation(
        JSON.stringify({
          "@context": ["https://www.w3.org/2018/credentials/v1"],
          id: "http://example.org/presentations/3731",
          type: ["VerifiablePresentation"],
          holder: other.did,
          verifiableCredential: credential,
        }),
        JSON.stringify({
          proofPurpose: "authentication",
          verificationMethod: verificationMethod,
        }),
        other.key
      );

      const verifyStr = await DIDKit.verifyPresentation(
        presentation,
        JSON.stringify({
          proofPurpose: "authentication",
        })
      );

      const verify = JSON.parse(verifyStr);

      if (verify.errors.length > 0) throw verify.errors;
    });
  }
);
