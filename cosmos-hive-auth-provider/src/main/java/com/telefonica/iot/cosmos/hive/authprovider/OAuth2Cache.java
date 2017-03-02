/**
 * Copyright 2016-2017 Telefonica Investigación y Desarrollo, S.A.U
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

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.Properties;
import org.apache.log4j.Logger;

/**
 *
 * @author frb
 */
public class OAuth2Cache {
    
    private static final Logger LOGGER = Logger.getLogger(OAuth2Cache.class);
    private final String cacheFile;
    private final HashMap<String, String> cache;
    
    /**
     * Constructor.
     * @param cacheFile
     */
    public OAuth2Cache(String cacheFile) {
        this.cacheFile = cacheFile;
        cache = new HashMap<>();
        loadCacheFromFile();
    } // OAuth2Cache
    
    /**
     * Gets if the pair (user, token) is cached or not.
     * @param user
     * @param token
     * @return True if the pair (user, token) is cached, otherwise false
     */
    public boolean isCached(String user, String token) {
        if (cache == null || cache.isEmpty()) {
            return false;
        } else {
            String storedToken = cache.get(user);
            
            if (storedToken == null) {
                return false;
            } else {
                return token.equals(storedToken);
            } // if else
        } // if else
    } // isCached
    
    /**
     * Adds the pais (user, token) to the cache.
     * @param user
     * @param token
     */
    public void addToCache(String user, String token) {
        cache.put(user, token);
        saveCacheToFile();
    } // addToCache
    
    private void loadCacheFromFile() {
        Properties props = new Properties();
        
        try {
            props.load(new FileInputStream(cacheFile));
        } catch (FileNotFoundException e) {
            LOGGER.error("Cache properties file not found when reading. Details: " + e.getMessage());
            return;
        } catch (IOException e) {
            LOGGER.error("There was a problem while reading the cache properties file. Details: "
                    + e.getMessage());
            return;
        } // try catch
    
        for (String key : props.stringPropertyNames()) {
            String value = props.getProperty(key);
            cache.put(key, value);
        } // for
    } // loadCacheFromFile
    
    private void saveCacheToFile() {
        PrintWriter writer;
                
        try {
            writer = new PrintWriter(new FileOutputStream(cacheFile));
        } catch (FileNotFoundException e) {
            LOGGER.error("Cache properties file not found when saving. Details: " + e.getMessage());
            return;
        } // try catch
        
        for (String key : cache.keySet()) {
            String value = cache.get(key);
            writer.println(key + "=" + value);
        } // for
        
        writer.flush();
        writer.close();
    } // saveCacheToFile
    
} // OAuth2Cache
