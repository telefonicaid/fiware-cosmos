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

import static com.telefonica.iot.cosmos.hive.authprovider.utils.Constants.CACHEBACKUPFILE;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import javax.security.sasl.AuthenticationException;
import org.apache.hadoop.hive.conf.HiveConf;
import org.apache.hive.service.auth.PasswdAuthenticationProvider;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpRequestBase;
import org.apache.log4j.Logger;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

/**
 * Custom implementation of the org.apache.hive.service.auth.PasswdAuthenticationProvider interface.
 * 
 * @author frb
 */
public class OAuth2AuthenticationProviderImpl implements PasswdAuthenticationProvider {
    
    private static final Logger LOGGER = Logger.getLogger(OAuth2AuthenticationProviderImpl.class);
    private static final OAuth2Cache CACHE = new OAuth2Cache(CACHEBACKUPFILE);
    private final HttpClientFactory httpClientFactory;
    private final String idmEndpoint;
    
    /**
     * Constructor.
     */
    public OAuth2AuthenticationProviderImpl() {
        // Get the configured Identity Manager endpoint
        HiveConf conf = null;
        
        try {
            conf = new HiveConf();
            LOGGER.debug("Hive configuration read");
        } catch (Exception e) {
            LOGGER.debug("Unable to read the Hive configuration, using default values");
        } finally {
            if (conf == null) {
                idmEndpoint = "https://account.lab.fiware.org";
                LOGGER.debug("Using hardcoded Identity Manager endpoint: https://account.lab.fiware.org");
            } else {
                idmEndpoint = conf.get("com.telefonica.iot.idm.endpoint", "https://account.lab.fiware.org");
                LOGGER.debug("com.telefonica.iot.idm.endpoint=" + idmEndpoint);
                LOGGER.debug("hive.server2.enable.doAs=" + conf.get("hive.server2.enable.doAs"));
                LOGGER.debug("hive.server2.authentication=" + conf.get("hive.server2.authentication"));
                LOGGER.debug("hive.server2.custom.authentication.class="
                        + conf.get("hive.server2.custom.authentication.class"));
                LOGGER.debug("hadoop.proxyuser.hive.groups=" + conf.get("hadoop.proxyuser.hive.groups"));
                LOGGER.debug("hadoop.proxyuser.hive.hosts=" + conf.get("hadoop.proxyuser.hive.hosts"));
            } // if else
        } // try catch finally
        
        // Create a factory of Http clients
        if (idmEndpoint.startsWith("https")) {
            httpClientFactory = new HttpClientFactory(true);
        } else {
            httpClientFactory = new HttpClientFactory(false);
        } // if else
    } // OAuth2AuthenticationProviderImpl

    @Override
    public void Authenticate(String user, String token) throws AuthenticationException {
        // Check the cache
        if (CACHE.isCached(user, token)) {
            LOGGER.info("User and token were cached, thus nothing to query to IdM");
            return;
        } // if
        
        LOGGER.info("User was not cached or token did not match, thus querying the IdM");
        
        // Create the Http client
        HttpClient httpClient = httpClientFactory.getHttpClient(true);
        
        // Create the request
        String url = idmEndpoint + "/user?access_token=" + token;
        HttpRequestBase request = new HttpGet(url);
        
        // Do the request
        HttpResponse httpRes = null;
        
        try {
            httpRes = httpClient.execute(request);
            LOGGER.debug("Doing request: " + request.toString());
        } catch (IOException e) {
            LOGGER.error("There was some problem when querying the IdM. Details: " + e.getMessage());
            throw new AuthenticationException(e.getMessage());
        } // try catch
        
        // Get the input streamResponse
        String streamResponse = "";
        
        try {
            BufferedReader reader = new BufferedReader(new InputStreamReader(httpRes.getEntity().getContent()));
            streamResponse = reader.readLine();
            LOGGER.debug("Response received: " + streamResponse);
        } catch (IOException e) {
            LOGGER.error("There was some problem when getting the response from the IdM. Details: " + e.getMessage());
            throw new AuthenticationException(e.getMessage());
        } // try catch
        
        // Parse the input streamResponse as a Json
        JSONObject jsonResponse = null;
        
        try {
            JSONParser jsonParser = new JSONParser();
            jsonResponse = (JSONObject) jsonParser.parse(streamResponse);
        } catch (ParseException e) {
            LOGGER.error("There was some problem when parsing the response from the IdM. Details: " + e.getMessage());
            throw new AuthenticationException(e.getMessage());
        } // try catch
        
        // Check if the given token does not exist
        if (jsonResponse.containsKey("error")) {
            LOGGER.error("The give token does not exist in the IdM");
            throw new AuthenticationException("The given token does not exist");
        } // if
        
        // Check if the obtained user id matches the given user
        if (jsonResponse.containsKey("id") && !jsonResponse.get("id").equals(user)) {
            LOGGER.error("The given token does not match the given user");
            throw new AuthenticationException("The given token does not match the given user");
        } // if
        
        // Release the connection
        request.releaseConnection();
        
        // User authenticated
        LOGGER.info("User " + user + " authenticated");
        
        // Cache the user
        CACHE.addToCache(user, token);
        LOGGER.info("User cached");
    } // Authenticate
    
} // OAuth2AuthenticationProviderImpl
