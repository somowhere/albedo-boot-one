package com.albedo.java.web.rest.handler;

import com.albedo.java.web.rest.ResultBuilder;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.web.BasicErrorController;
import org.springframework.boot.autoconfigure.web.ErrorAttributes;
import org.springframework.boot.autoconfigure.web.ErrorController;
import org.springframework.boot.autoconfigure.web.ErrorProperties;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Map;

/**
 * Created by somewhere on 2017/3/2.
 */
@Controller
public class HttpErrorHandler implements ErrorController {


    private static final String PATH = "/error";

    @Autowired
    private ErrorAttributes errorAttributes;

    @RequestMapping(value = PATH,  produces = {MediaType.APPLICATION_JSON_VALUE})
    ResponseEntity error(HttpServletRequest request, HttpServletResponse response) {
        return buildBody(request,true);

    }

    private ResponseEntity buildBody(HttpServletRequest request,Boolean includeStackTrace){
        Map<String,Object> errorAttributes = getErrorAttributes(request, includeStackTrace);
        Integer status=(Integer)errorAttributes.get("status");
        String path=(String)errorAttributes.get("path");
        String messageFound=(String)errorAttributes.get("message");
        String message="";
        String trace ="";
        if(!StringUtils.isEmpty(path)){
            message=String.format("Requested path %s with result %s",path,messageFound);
        }
        if(includeStackTrace) {
            trace = (String) errorAttributes.get("trace");
            if(!StringUtils.isEmpty(trace)) {
                message += String.format(" and trace %s", trace);
            }
        }
        return ResultBuilder.buildFailed(HttpStatus.valueOf(status), message);
    }

    @Override
    public String getErrorPath() {
        return PATH;
    }

    protected Map<String, Object> getErrorAttributes(HttpServletRequest request, boolean includeStackTrace) {
        RequestAttributes requestAttributes = new ServletRequestAttributes(request);
        return errorAttributes.getErrorAttributes(requestAttributes, includeStackTrace);
    }
}
