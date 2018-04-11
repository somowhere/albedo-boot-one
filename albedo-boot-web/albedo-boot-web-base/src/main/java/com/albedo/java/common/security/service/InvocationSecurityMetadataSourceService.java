package com.albedo.java.common.security.service;

import com.albedo.java.common.config.AlbedoProperties;
import com.albedo.java.common.security.SecurityConstants;
import com.albedo.java.common.security.annotaion.RequiresPermissions;
import com.albedo.java.modules.sys.domain.Dict;
import com.albedo.java.modules.sys.domain.Module;
import com.albedo.java.modules.sys.service.ModuleService;
import com.albedo.java.util.DictUtil;
import com.albedo.java.util.JedisUtil;
import com.albedo.java.util.PublicUtil;
import com.albedo.java.util.StringUtil;
import com.albedo.java.util.domain.GlobalJedis;
import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.security.access.ConfigAttribute;
import org.springframework.security.access.SecurityConfig;
import org.springframework.security.web.FilterInvocation;
import org.springframework.security.web.access.intercept.FilterInvocationSecurityMetadataSource;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerExecutionChain;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.*;
import java.util.stream.Collectors;

@Component("invocationSecurityMetadataSourceService")
public class InvocationSecurityMetadataSourceService
        implements FilterInvocationSecurityMetadataSource {
    public static final String URL_SPILT = "--";
    private final Logger log = LoggerFactory.getLogger(InvocationSecurityMetadataSourceService.class);
    public static List<String> authorizePermitAllList = Lists.newArrayList(SecurityConstants.authorizePermitAll);
    @Resource
    ApplicationContext applicationContext;
    @Resource
    AlbedoProperties albedoProperties;
    private Map<String, Collection<ConfigAttribute>> resourceMap = null;
    @Resource
    private ModuleService moduleService;


    @Resource
    private RequestMappingHandlerMapping requestMappingHandlerMapping;

    public boolean isAuthorizeUrlStart(String url){
        for (int i=0; i<SecurityConstants.authorize.length; i++){
            if(url.startsWith(SecurityConstants.authorize[i].replace("**", ""))){
                return true;
            }
        }
        return false;
    }

    public boolean isMatchRequest(String url, HttpServletRequest request){
        try{
            if(url.indexOf(URL_SPILT)!=-1){
                String[] temp = url.split(URL_SPILT);
                ArrayList<String> strings = Lists.newArrayList(temp[1].split(StringUtil.SPLIT_DEFAULT));
                for (String requestMethod : strings) {
                    if (new AntPathRequestMatcher(temp[0], requestMethod).matches(request)) {
                        return true;
                    }
                }
            }
            return new AntPathRequestMatcher(url).matches(request);
        }catch (Exception e){
            log.warn("{}", e);
        }
        return false;
    }

    public Map<String, Collection<ConfigAttribute>> getResourceMap() {
        resourceMap = (Map<String, Collection<ConfigAttribute>>) JedisUtil.getSys(GlobalJedis.RESOURCE_MODULE_DATA_MAP);
        if (resourceMap == null) {
            if (resourceMap == null) {
                resourceMap = Maps.newHashMap();
            }

            if (PublicUtil.isEmpty(resourceMap)) {
                List<Module> moduleList = moduleService.findAllByStatusOrderBySort(Module.FLAG_NORMAL);
                List<Dict> dictRequestList = DictUtil.getDictList("sys_request_method");
                moduleList.stream().forEach(item -> {
                    if (PublicUtil.isNotEmpty(item.getPermission())) {

                        Lists.newArrayList(item.getPermission().split(StringUtil.SPLIT_DEFAULT)).forEach(p -> {
                            ConfigAttribute ca = new SecurityConfig(p);
                            String tempUrl = item.getUrl();
                            List<String> keyList = Lists.newArrayList();
                            if (PublicUtil.isNotEmpty(tempUrl)) {
                                (tempUrl.indexOf(StringUtil.SPLIT_DEFAULT) == -1 ? Lists.newArrayList(tempUrl) :
                                    Lists.newArrayList(tempUrl.split(StringUtil.SPLIT_DEFAULT))).forEach(url -> {

                                    StringBuilder sb = new StringBuilder(!isAuthorizeUrlStart(url)? albedoProperties.getAdminPath():"").append(url).append(URL_SPILT);
                                    if (PublicUtil.isEmpty(item.getRequestMethod())) {
                                        dictRequestList.forEach(dict -> keyList.add(PublicUtil.toAppendStr(sb.toString(), dict.getVal())));
                                    } else {
                                        Lists.newArrayList(item.getRequestMethod().split(StringUtil.SPLIT_DEFAULT))
                                            .forEach(method -> keyList.add(PublicUtil.toAppendStr(sb.toString(), item.getRequestMethod())));
                                    }
                                });
                            }
                            if (PublicUtil.isNotEmpty(keyList)) {
                                keyList.forEach(key -> {
                                /*
                                 * 判断资源文件和权限的对应关系，如果已经存在相关的资源url，则要通过该url为key提取出权限集合，
								 * 将权限增加到权限集合中。 sparta
								 */
                                    if (resourceMap.containsKey(key)) {
                                        Collection<ConfigAttribute> value = resourceMap.get(key);
                                        long count = value.stream()
                                            .filter(itemValue -> itemValue.getAttribute().equals(ca.getAttribute())).count();
                                        if(count<1){
                                            value.add(ca);
                                            resourceMap.put(key, value);
                                        }
                                    } else {
                                        Collection<ConfigAttribute> atts = Lists.newArrayList();
                                        atts.add(ca);
                                        resourceMap.put(key, atts);
                                    }

                                });
                            }
                        });

                    }
                });
                JedisUtil.putSys(GlobalJedis.RESOURCE_MODULE_DATA_MAP, resourceMap);
            }
        }

        return resourceMap;

    }


    @Override
    public Collection<ConfigAttribute> getAllConfigAttributes() {
        return moduleService.findAllByStatusOrderBySort(Module.FLAG_NORMAL).stream()
                .map(item -> new SecurityConfig(item.getPermission())).collect(Collectors.toList());
    }

    // 根据URL，找到相关的权限配置。
    @Override
    public Collection<ConfigAttribute> getAttributes(Object object) throws IllegalArgumentException {

        // object 是一个URL，被用户请求的url。 /swagger-ui/index.html "/swagger-ui/index.html-GET" -> " size = 1"
        FilterInvocation filterInvocation = (FilterInvocation) object;
        HttpServletRequest request = filterInvocation.getHttpRequest();

        try {
            HandlerExecutionChain handlerExecutionChain = requestMappingHandlerMapping.getHandler(request);
            if(handlerExecutionChain!=null){
                Object handler = handlerExecutionChain.getHandler();
                if (handler instanceof HandlerMethod) {
                    HandlerMethod handlerMethod = (HandlerMethod) handler;
                    RequiresPermissions requiresPermissions = handlerMethod.getMethodAnnotation(RequiresPermissions.class);
                    if(requiresPermissions!=null && PublicUtil.isNotEmpty(requiresPermissions.value())){
                        Collection<ConfigAttribute> atts = Lists.newArrayList();
                        for(String permission: requiresPermissions.value()){
                            atts.add(new SecurityConfig(permission));
                        }
                        return atts;
                    }
                }
            }
        } catch (Exception e) {
            log.info("{}",e);
        }
        Map<String, Collection<ConfigAttribute>> resourceMap = getResourceMap();
        Iterator<String> ite = resourceMap.keySet().iterator();
        String url;
        while (ite.hasNext()) {
            url = ite.next();
            if (PublicUtil.isNotEmpty(url)) {
                if (isMatchRequest(url, request)) {
                    SecurityConstants.setCurrentUrl(url);
                    return resourceMap.get(url);
                }
            }

        }
        if (new AntPathRequestMatcher(albedoProperties.getAdminPath(SecurityConstants.loginUrl)).matches(request)
                || new AntPathRequestMatcher(albedoProperties.getAdminPath(SecurityConstants.authLogin)).matches(request)
                || new AntPathRequestMatcher(albedoProperties.getAdminPath(SecurityConstants.logoutUrl)).matches(request)) {
            return null;
        }

        for (int i = 0; i < SecurityConstants.authorizePermitAll.length; i++) {
            if (new AntPathRequestMatcher(SecurityConstants.authorizePermitAll[i]).matches(request)) {
                return null;
            }
        }
        for (int i = 0; i < SecurityConstants.authorize.length; i++) {
            if (new AntPathRequestMatcher(SecurityConstants.authorize[i]).matches(request)) {
                return Lists.newArrayList(new SecurityConfig("user"));
            }
        }
        return null;

    }

    @Override
    public boolean supports(Class<?> arg0) {
        return true;
    }

}
