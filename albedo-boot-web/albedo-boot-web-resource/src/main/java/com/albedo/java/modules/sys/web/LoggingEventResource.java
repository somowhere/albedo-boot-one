package com.albedo.java.modules.sys.web;

import com.albedo.java.modules.sys.domain.LoggingEvent;
import com.albedo.java.modules.sys.service.LoggingEventService;
import com.albedo.java.util.JsonUtil;
import com.albedo.java.util.domain.PageModel;
import com.albedo.java.web.rest.ResultBuilder;
import com.albedo.java.web.rest.base.BaseResource;
import com.alibaba.fastjson.JSON;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * 操作日志Controller 操作日志
 *
 * @author admin
 * @version 2017-01-03
 */
@Controller
@RequestMapping(value = "${albedo.adminPath}/sys/loggingEvent")
public class LoggingEventResource extends BaseResource {


    private final LoggingEventService loggingEventService;

    public LoggingEventResource(LoggingEventService loggingEventService) {
        this.loggingEventService = loggingEventService;
    }


    /**
     * @param pm
     */
    @GetMapping(value = "/")
    public ResponseEntity getPage(PageModel<LoggingEvent> pm) {
        loggingEventService.findPage(pm);
        JSON rs = JsonUtil.getInstance().setRecurrenceStr().toJsonObject(pm);
        return ResultBuilder.buildObject(rs);
    }

}
