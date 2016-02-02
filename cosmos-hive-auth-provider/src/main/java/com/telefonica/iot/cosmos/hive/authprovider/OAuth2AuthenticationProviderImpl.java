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
    
    private static final Logger LOGGER = Logger.getLogger(HttpClientFactory.class);
    private final HttpClientFactory httpClientFactory;
    private final String idmEndpoint;
    
    /**
     * Constructor.
     */
    public OAuth2AuthenticationProviderImpl() {
        // get the cnfigured Identity Manager endpoint
        HiveConf conf = null;
        
        try {
            conf = new HiveConf();
        } catch (Exception e) {
            LOGGER.info("Unable to read the Hive configuration, using default values");
        } finally {
            if (conf == null) {
                idmEndpoint = "https://account.lab.fiware.org";
            } else {
                idmEndpoint = conf.get("com.telefonica.iot.idm.endpoint", "https://account.lab.fiware.org");
            } // if else
        } // try catch finally
        
        // create a factory of Http clients
        if (idmEndpoint.startsWith("https")) {
            httpClientFactory = new HttpClientFactory(true);
        } else {
            httpClientFactory = new HttpClientFactory(false);
        } // if else
    } // OAuth2AuthenticationProviderImpl

    @Override
    public void Authenticate(String user, String token) throws AuthenticationException {
        // create the Http client
        HttpClient httpClient = httpClientFactory.getHttpClient(true);
        
        // create the request
        String url = idmEndpoint + "/user?access_token=" + token;
        HttpRequestBase request = new HttpGet(url);
        
        // do the request
        HttpResponse httpRes = null;
        
        try {
            httpRes = httpClient.execute(request);
            LOGGER.debug("Doing request: " + request.toString());
        } catch (IOException e) {
            throw new AuthenticationException(e.getMessage());
        } // try catch
        
        // get the input streamResponse
        String streamResponse = "";
        
        try {
            BufferedReader reader = new BufferedReader(new InputStreamReader(httpRes.getEntity().getContent()));
            streamResponse = reader.readLine();
            LOGGER.debug("Response received: " + streamResponse);
        } catch (IOException e) {
            throw new AuthenticationException(e.getMessage());
        } // try catch
        
        // parse the input streamResponse as a Json
        JSONObject jsonResponse = null;
        
        try {
            JSONParser jsonParser = new JSONParser();
            jsonResponse = (JSONObject) jsonParser.parse(streamResponse);
        } catch (ParseException e) {
            throw new AuthenticationException(e.getMessage());
        } // try catch
        
        // check if the given token does not exist
        if (jsonResponse.containsKey("error")) {
            throw new AuthenticationException("The given token does not exist");
        } // if
        
        // check if the obtained user id matches the given user
        if (jsonResponse.containsKey("id") && !jsonResponse.get("id").equals(user)) {
            throw new AuthenticationException("The given token does not match the given user");
        } // if
        
        // release the connection
        request.releaseConnection();
        
        LOGGER.debug("User " + user + " authenticated");
    } // Authenticate
    
} // OAuth2AuthenticationProviderImpl
