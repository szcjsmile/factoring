/**
 * 
 */
package com.smile.start.controller.project;

import javax.annotation.Resource;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.github.pagehelper.PageInfo;
import com.smile.start.commons.FastJsonUtils;
import com.smile.start.commons.LoggerUtils;
import com.smile.start.controller.BaseController;
import com.smile.start.model.base.BaseResult;
import com.smile.start.model.base.PageRequest;
import com.smile.start.model.enums.Progress;
import com.smile.start.model.enums.ProjectKind;
import com.smile.start.model.project.Project;
import com.smile.start.service.project.ProjectService;

/**
 * 
 * @author smile.jing
 * @version $Id: ApprovalController.java, v 0.1 Jan 13, 2019 9:32:21 PM smile.jing Exp $
 */
@Controller
@RequestMapping("/approval")
public class ApprovalController extends BaseController {

    /** 项目服务 */
    @Resource
    private ProjectService projectService;

    /**
     * 项目立项页
     * 
     * @return
     */
    @GetMapping
    public String index() {
        return "project/approval";
    }

    /**
     * 新增项目
     * 
     * @param project
     * @return
     */
    @PostMapping
    @ResponseBody
    public BaseResult add(@RequestBody Project project) {
        project.setKind(ProjectKind.FACTORING);
        project.setProgress(Progress.INIT);
        LoggerUtils.info(logger, "新增项目请求参数={}", FastJsonUtils.toJSONString(project));
        return projectService.initProject(project);
    }

    /**
     * 更新项目
     * @param project
     * @return
     */
    @PutMapping
    @ResponseBody
    public BaseResult edit(@RequestBody Project project) {
        LoggerUtils.info(logger, "修改项目请求参数={}", FastJsonUtils.toJSONString(project));
        try {
            return projectService.updateProject(project);
        } catch (RuntimeException e) {
            return toResult(e);
        }
    }

    /**
     * 删除项目
     * @param id
     * @return
     */
    @DeleteMapping(value = "/{id}")
    @ResponseBody
    public BaseResult delete(@PathVariable Long id) {
        try {
            LoggerUtils.info(logger, "删除项目id={}", id);
            return projectService.delete(id);
        } catch (RuntimeException e) {
            return toResult(e);
        }
    }

    /**
     * 分页查询
     * @param query
     * @return
     */
    @PostMapping("/query")
    @ResponseBody
    public PageInfo<Project> queryByParam(@RequestBody PageRequest<Project> query) {
        LoggerUtils.info(logger, "查询请求参数={}", FastJsonUtils.toJSONString(query));
        PageInfo<Project> result = projectService.queryPage(query);
        return result;
    }
}
