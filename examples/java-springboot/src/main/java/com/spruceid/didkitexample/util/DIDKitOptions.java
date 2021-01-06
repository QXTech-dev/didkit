package com.spruceid.didkitexample.util;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class DIDKitOptions {
    private String proofPurpose;
    private String verificationMethod;
}
