package com.spruceid.didkitexample.auth;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.spruceid.DIDKit;
import com.spruceid.didkitexample.entity.User;
import com.spruceid.didkitexample.user.UserService;
import com.spruceid.didkitexample.util.DIDKitOptions;
import lombok.AllArgsConstructor;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Component;

import java.nio.file.Files;
import java.util.List;
import java.util.Map;

@Component
@AllArgsConstructor
public class VPAuthenticationProvider implements AuthenticationProvider {
    private final UserService userService;

    @Override
    public Authentication authenticate(Authentication auth) throws AuthenticationException {
        final VPAuthenticationToken token = (VPAuthenticationToken) auth;
        final Map<String, Object> presentation = token.getPresentation();

        try {
            final Resource keyFile = new FileSystemResource("./key.jwk");
            final String key = Files.readString(keyFile.getFile().toPath());
            final String verificationMethod = DIDKit.keyToVerificationMethod(key);

            final ObjectMapper mapper = new ObjectMapper();
            final DIDKitOptions options = new DIDKitOptions("authentication", verificationMethod, null, "theosirian.com");
            final String presentationStr = mapper.writeValueAsString(presentation);
            final String optionsStr = mapper.writeValueAsString(options);

            final String result = DIDKit.verifyPresentation(presentationStr, optionsStr);
            final Map<String, Object> resultMap = mapper.readValue(result, new TypeReference<>() {
            });

            if (((List<String>) resultMap.get("errors")).size() > 0) {
                throw new BadCredentialsException("Invalid presentation.");
            }
        } catch (Exception e) {
            throw new BadCredentialsException("Invalid presentation.");
        }

        final Map<String, Object> verifiableCredential = (Map<String, Object>) presentation.get("verifiableCredential");
        // TODO: verify credential
        final Map<String, Object> credentialSubject = (Map<String, Object>) verifiableCredential.get("credentialSubject");
        final String username = credentialSubject.get("alumniOf").toString();
        final User user = (User) userService.loadUserByUsername(username);

        return new VPAuthenticationToken(token.getPresentation(), user);
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return VPAuthenticationToken.class.isAssignableFrom(authentication);
    }
}

