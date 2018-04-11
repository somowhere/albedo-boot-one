package com.albedo.java.modules.base.web;

import com.albedo.java.common.config.AlbedoProperties;
import com.albedo.java.common.security.SecurityAuthUtil;
import com.albedo.java.common.security.SecurityConstants;
import com.albedo.java.common.security.SecurityUtil;
import com.albedo.java.common.security.jwt.TokenProvider;
import com.albedo.java.modules.sys.service.UserService;
import com.albedo.java.util.PublicUtil;
import com.albedo.java.util.base.Assert;
import com.albedo.java.util.config.SystemConfig;
import com.albedo.java.util.domain.CustomMessage;
import com.albedo.java.util.spring.SpringContextHolder;
import com.albedo.java.vo.account.LoginVo;
import com.albedo.java.vo.account.PasswordChangeVo;
import com.albedo.java.vo.sys.UserVo;
import com.albedo.java.web.rest.ResultBuilder;
import com.albedo.java.web.rest.base.BaseResource;
import com.albedo.java.web.rest.util.CookieUtil;
import com.codahale.metrics.annotation.Timed;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.util.Optional;

/**
 * REST controller for managing the current user's account.
 *
 * @author somewhere
 */
@RestController
@RequestMapping("${albedo.adminPath}/")
public class AccoutResource extends BaseResource {

    public final static String LOGIN_FAIL_MAP = "loginFailMap";
    @Resource
    private AlbedoProperties albedoProperties;
    @Resource
    private UserService userService;
    private final TokenProvider tokenProvider;
    @Autowired(required = false)
    private PasswordEncoder passwordEncoder;

    private final AuthenticationManager authenticationManager;

    public AccoutResource(TokenProvider tokenProvider, AuthenticationManager authenticationManager) {
        log.warn(PublicUtil.toAppendStr("Abledo_Boot Web [", SystemConfig.get("version"), "] 框架开发版权所有 Copyright(c) 2010-2018\n未经授权非法复制,使用,传播,销售,本公司必究法律责任"));
        this.tokenProvider = tokenProvider;
        this.authenticationManager = authenticationManager;
    }
    /**
     * GET  /account : get the current user.
     *
     * @return the current user
     * @throws RuntimeException 500 (Internal Server Error) if the user couldn't be returned
     */
    @GetMapping("/account")
    @Timed
    public ResponseEntity getAccount() {
        String id = SecurityUtil.getCurrentUserId();
        if(PublicUtil.isNotEmpty(id)){
            Optional<UserVo> userVo = userService.findOneById(id)
                .map(item -> userService.copyBeanToVo(item));
            userVo.get().setAuthorities(SecurityUtil.getCurrentUserAuthorities());
            return ResultBuilder.buildOk(userVo);
        }
        return ResultBuilder.buildFailed("没有数据");
    }
    /**
     * GET  /authenticate : check if the user is authenticated, and return its login.
     *
     * @param request the HTTP request
     * @return the login if the user is authenticated
     */
    @GetMapping("/authenticate")
    @Timed
    public String isAuthenticated(HttpServletRequest request) {
        log.debug("REST request to check if the current user is authenticated");
        return request.getRemoteUser();
    }

    @PostMapping("authenticate")
    @Timed
    public ResponseEntity authorize(@Valid @RequestBody LoginVo loginVo, HttpServletResponse response) {

        UsernamePasswordAuthenticationToken authenticationToken =
                new UsernamePasswordAuthenticationToken(loginVo.getUsername(), loginVo.getPassword());

        try {
            logger.info(SpringContextHolder.getApplicationContext().toString());
            Authentication authentication = this.authenticationManager.authenticate(authenticationToken);
            SecurityContextHolder.getContext().setAuthentication(authentication);
            boolean rememberMe = (loginVo.isRememberMe() == null) ? false : loginVo.isRememberMe();
            String jwt = "Bearer " + tokenProvider.createToken(authentication, rememberMe);
            HttpHeaders httpHeaders = new HttpHeaders();
            httpHeaders.add(SecurityConstants.AUTHORIZATION_HEADER, jwt);
            return new ResponseEntity<>(CustomMessage.createSuccessData(jwt), httpHeaders, HttpStatus.OK);

        } catch (AuthenticationException ae) {
            log.warn("Authentication exception trace: {}", ae);
            return ResultBuilder.buildFailed(HttpStatus.UNAUTHORIZED, ae instanceof BadCredentialsException ? "用户名或密码填写错误" : ae.getMessage());
        }
    }

    @GetMapping(value = "logout")
    public ResponseEntity logout(HttpServletRequest request, HttpServletResponse response) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null) {
            new SecurityContextLogoutHandler().logout(request, response, auth);
        }
        CookieUtil.removeCookie(request, response, SecurityConstants.AUTHORIZATION_HEADER);
        request.getSession().invalidate();
        return ResultBuilder.buildOk("退出登录成功");

    }
    private static boolean checkPasswordLength(String password) {
        return !StringUtils.isEmpty(password) &&
            password.length() >= UserVo.PASSWORD_MIN_LENGTH &&
            password.length() <= UserVo.PASSWORD_MAX_LENGTH;
    }
    /**
     * POST  /account/change-password : changes the current user's password
     *
     * @param passwordChangeVo the passwordVo
     */
    @PostMapping(path = "/account/change-password")
    @Timed
    public ResponseEntity changePassword(@Valid @RequestBody PasswordChangeVo passwordChangeVo) {

        Assert.assertIsTrue(passwordChangeVo!=null&&
            checkPasswordLength(passwordChangeVo.getNewPassword()), "密码格式有误");
        Assert.assertIsTrue(!passwordChangeVo.getNewPassword().equals(passwordChangeVo.getOldPassword()),
            "新旧密码不能相同");
        Assert.assertIsTrue(passwordChangeVo.getNewPassword().equals(passwordChangeVo.getConfirmPassword()),
            "两次输入密码不一致");
        Assert.assertIsTrue(passwordEncoder.matches(passwordChangeVo.getOldPassword(), SecurityUtil.getCurrentUser().getPassword()),
            "输入原密码有误");

        userService.changePassword(SecurityAuthUtil.getCurrentUserLogin(), passwordEncoder.encode(passwordChangeVo.getNewPassword()));
        return ResultBuilder.buildOk("修改成功");
    }

}
