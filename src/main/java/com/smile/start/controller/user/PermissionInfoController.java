package com.smile.start.controller.user;

import com.smile.start.controller.BaseController;
import com.smile.start.dto.AuthPermissionInfoDTO;
import com.smile.start.model.base.BaseResult;
import com.smile.start.model.base.SingleResult;
import com.smile.start.service.PermissionInfoService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;

/**
 * @author Joseph
 * @version v1.0 2019/1/6 14:38, PermissionInfoController.java
 * @since 1.8
 */
@Controller
@RequestMapping(value = "/permission")
public class PermissionInfoController extends BaseController {

    @Resource
    private PermissionInfoService permissionInfoService;

    /**
     *
     * @param id
     * @return
     */
    @GetMapping(value = "/{id}")
    @ResponseBody
    public SingleResult<AuthPermissionInfoDTO> get(@PathVariable Long id) {
        try {
            SingleResult<AuthPermissionInfoDTO> result = new SingleResult<>();
            AuthPermissionInfoDTO authPermissionInfo = permissionInfoService.get(id);
            result.setSuccess(true);
            result.setData(authPermissionInfo);
            return result;
        } catch (Exception e) {
            logger.error("查询权限信息失败", e);
            return toResult(e, AuthPermissionInfoDTO.class);
        }
    }

    /**
     *
     * @param authPermissionInfoDTO
     * @return
     */
    @PostMapping
    @ResponseBody
    public BaseResult add(@RequestBody AuthPermissionInfoDTO authPermissionInfoDTO) {
        try {
            permissionInfoService.insert(authPermissionInfoDTO);
            BaseResult result = new BaseResult();
            result.setSuccess(true);
            result.setErrorMessage("新增权限成功");
            return result;
        } catch (Exception e) {
            logger.error("新增权限信息失败", e);
            return toResult(e);
        }
    }

    /**
     *
     * @param authPermissionInfoDTO
     * @return
     */
    @PutMapping
    @ResponseBody
    public BaseResult update(@RequestBody AuthPermissionInfoDTO authPermissionInfoDTO) {
        try {
            permissionInfoService.update(authPermissionInfoDTO);
            BaseResult result = new BaseResult();
            result.setSuccess(true);
            result.setErrorMessage("更新权限成功");
            return result;
        } catch (Exception e) {
            logger.error("更新权限信息失败", e);
            return toResult(e);
        }
    }

    /**
     *
     * @param id
     * @return
     */
    @DeleteMapping(value = "/{id}")
    @ResponseBody
    public BaseResult delete(@PathVariable Long id) {
        try {
            permissionInfoService.delete(id);
            BaseResult result = new BaseResult();
            result.setSuccess(true);
            result.setErrorMessage("删除权限成功");
            return result;
        } catch (Exception e) {
            logger.error("删除权限信息失败", e);
            return toResult(e);
        }
    }
}
