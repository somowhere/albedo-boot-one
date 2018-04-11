package com.albedo.java.modules.sys.web;

import com.albedo.java.common.security.SecurityUtil;
import com.albedo.java.modules.sys.domain.TaskScheduleJob;
import com.albedo.java.modules.sys.service.TaskScheduleJobExcutorService;
import com.albedo.java.util.JsonUtil;
import com.albedo.java.util.StringUtil;
import com.albedo.java.util.domain.Globals;
import com.albedo.java.util.domain.PageModel;
import com.albedo.java.vo.sys.TaskScheduleJobVo;
import com.albedo.java.web.rest.ResultBuilder;
import com.albedo.java.web.rest.base.DataVoResource;
import com.alibaba.fastjson.JSON;
import com.google.common.collect.Lists;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

/**
 * 任务调度管理Controller 任务调度
 *
 * @author lj
 * @version 2017-01-23
 */
@ConditionalOnProperty(name = Globals.ALBEDO_QUARTZENABLED)
@Controller
@RequestMapping(value = "${albedo.adminPath}/sys/taskScheduleJob")
public class TaskScheduleJobResource extends DataVoResource<TaskScheduleJobExcutorService, TaskScheduleJobVo> {

    public TaskScheduleJobResource(TaskScheduleJobExcutorService service) {
        super(service);
    }

    /**
     * @param pm
     */
    @GetMapping(value = "/")
    public ResponseEntity getPage(PageModel<TaskScheduleJob> pm) {
        pm = service.findAll(pm, SecurityUtil.dataScopeFilter());
        JSON rs = JsonUtil.getInstance().setRecurrenceStr().toJsonObject(pm);
        return ResultBuilder.buildObject(rs);
    }

    /**
     * @param taskScheduleJobVo
     * @return
     */
    @PostMapping(value = "/", produces = MediaType.APPLICATION_JSON_VALUE)

    public ResponseEntity save(@Valid @RequestBody TaskScheduleJobVo taskScheduleJobVo) {
        log.debug("REST request to save TaskScheduleJobVo : {}", taskScheduleJobVo);
        service.save(taskScheduleJobVo);

        return ResultBuilder.buildOk("保存任务调度成功");
    }

    /**
     * @param ids
     * @return
     */
    @DeleteMapping(value = "/{ids:" + Globals.LOGIN_REGEX
            + "}")

    public ResponseEntity delete(@PathVariable String ids) {
        log.debug("REST request to delete TaskScheduleJob: {}", ids);
        service.deleteBatchIds(Lists.newArrayList(ids.split(StringUtil.SPLIT_DEFAULT)));
        return ResultBuilder.buildOk("删除任务调度成功");
    }

    /**
     * @param ids
     * @return
     */
    @PutMapping(value = "/{ids:" + Globals.LOGIN_REGEX
            + "}")

    public ResponseEntity lockOrUnLock(@PathVariable String ids) {
        log.debug("REST request to lockOrUnLock TaskScheduleJob: {}", ids);
        service.lockOrUnLock(Lists.newArrayList(ids.split(StringUtil.SPLIT_DEFAULT)));
        return ResultBuilder.buildOk("操作任务调度成功");
    }

}
