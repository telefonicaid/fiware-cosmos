/**
 * Copyright 2016 Telefonica Investigación y Desarrollo, S.A.U
 *
 * This file is part of fiware-cosmos (FI-WARE project).
 *
 * fiware-cosmos is free software: you can redistribute it and/or modify it under the terms of the GNU Affero
 * General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your
 * option) any later version.
 * fiware-cosmos is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the
 * implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License
 * for more details.
 *
 * You should have received a copy of the GNU Affero General Public License along with fiware-cosmos. If not, see
 * http://www.gnu.org/licenses/.
 *
 * For those usages not covered by the GNU Affero General Public License please contact with iot_support at tid dot es
 */
package com.telefonica.iot.cosmos.hive.authprovider;

import javax.security.sasl.AuthenticationException;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;
import org.junit.Test;

/**
 * Suite of tests for OAuth2AuthenticationProviderImpl.
 * 
 * @author frb
 */
public class OAuth2AuthenticationProviderImplTest {
    
    private final String matchingUser = "frb";
    private final String notMatchingUser = "other";
    private static String matchingToken;
    private final String notMatchingToken = "000000000000000000000000000000";
    
    static {
        matchingToken = System.getProperty("token");
    } // static
    
    /**
     * Tests OAuth2AuthenticationProviderImpl.Authenticate when the given user and token match.
     */
    @Test
    public void testAuthenticateSuccess() {
        System.out.println("Testing OAuth2AuthenticationProviderImpl.Authenticate, it must success");
        
        try {
            OAuth2AuthenticationProviderImpl oapi = new OAuth2AuthenticationProviderImpl();
            oapi.Authenticate(matchingUser, matchingToken);
        } catch (AuthenticationException e) {
            fail(e.getMessage());
        } finally {
            assertTrue(true);
        } // try catch finally
    } // testAuthenticateSuccess
    
    /**
     * Tests OAuth2AuthenticationProviderImpl.Authenticate when the given user and token don't match.
     */
    @Test
    public void testAuthenticateFail() {
        System.out.println("Testing OAuth2AuthenticationProviderImpl.Authenticate, "
                + "it must fail because the user and the token don't match");
        
        try {
            OAuth2AuthenticationProviderImpl oapi = new OAuth2AuthenticationProviderImpl();
            oapi.Authenticate(notMatchingUser, matchingToken);
            assertTrue(false);
        } catch (AuthenticationException e) {
            assertTrue(true);
        } // try catch
    } // testAuthenticateFail
    
    /**
     * Tests OAuth2AuthenticationProviderImpl.Authenticate when the given token does not exist.
     */
    @Test
    public void testAuthenticateUnexistentToken() {
        System.out.println("Testing OAuth2AuthenticationProviderImpl.Authenticate, "
                + "it must fail because the token does not exist");
        
        try {
            OAuth2AuthenticationProviderImpl oapi = new OAuth2AuthenticationProviderImpl();
            oapi.Authenticate(matchingUser, notMatchingToken);
            assertTrue(false);
        } catch (AuthenticationException e) {
            assertTrue(true);
        } // try catch
    } // testAuthenticateUnexistentToken
    
} // OAuth2AuthenticationProviderImplTest
