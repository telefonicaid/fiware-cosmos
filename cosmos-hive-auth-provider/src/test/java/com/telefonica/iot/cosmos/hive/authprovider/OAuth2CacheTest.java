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

import static org.junit.Assert.assertTrue;
import org.junit.Test;

/**
 *
 * @author frb
 */
public class OAuth2CacheTest {
    
    /**
     * Tests OAuth2Cache.isCached, it must return true when user and token exist.
     */
    @Test
    public void testIsCachedUserAndTokenOK() {
        System.out.println("Testing OAuth2Cache.isCached, it must return true when user and token exist");
        String user = "user";
        String token = "token";
        OAuth2Cache cache = new OAuth2Cache("");
        cache.addToCache(user, token);
        
        if (cache.isCached(user, token)) {
            assertTrue(true);
        } else {
            assertTrue(false);
        } // if else
    } // testIsCachedUserAndTokenOK
    
    /**
     * Tests OAuth2Cache.isCached, it must return false when user exist, but token does not exist.
     */
    @Test
    public void testIsCachedUserOKTokenNotOK() {
        System.out.println("Testing OAuth2Cache.isCached, it must return false when user exist, "
                + "but token does not exist");
        String user = "user";
        String token1 = "token1";
        String token2 = "token2";
        OAuth2Cache cache = new OAuth2Cache("");
        cache.addToCache(user, token1);
        
        if (cache.isCached(user, token2)) {
            assertTrue(false);
        } else {
            assertTrue(true);
        } // if else
    } // testIsCachedUserOKTokenNotOK
    
    /**
     * Tests OAuth2Cache.isCached, it must return false when both user and token do not exist.
     */
    @Test
    public void testIsCachedUserAndTokenNotOK() {
        System.out.println("Testing OAuth2Cache.isCached, it must return false when both user and token do not exist");
        String user = "user";
        String token = "token";
        OAuth2Cache cache = new OAuth2Cache("");
        
        if (cache.isCached(user, token)) {
            assertTrue(false);
        } else {
            assertTrue(true);
        } // if else
    } // testIsCachedUserAndTokenNotOK
    
} // OAuth2CacheTest
