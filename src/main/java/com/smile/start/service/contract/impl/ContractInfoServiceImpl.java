package com.smile.start.service.contract.impl;

import com.github.pagehelper.PageInfo;
import com.smile.start.commons.SerialNoGenerator;
import com.smile.start.dao.ContractInfoDao;
import com.smile.start.dao.ContractSignListDao;
import com.smile.start.dto.*;
import com.smile.start.mapper.ContractInfoMapper;
import com.smile.start.model.base.PageRequest;
import com.smile.start.model.contract.ContractInfo;
import com.smile.start.model.contract.ContractSignList;
import com.smile.start.model.contract.SignListTemplate;
import com.smile.start.service.contract.ContractInfoService;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.Date;
import java.util.List;

/**
 * @author Joseph
 * @version v1.0 2019/2/19 20:49, ContractInfoServiceImpl.java
 * @since 1.8
 */
@Service
public class ContractInfoServiceImpl implements ContractInfoService {

    @Resource
    private ContractInfoDao contractInfoDao;

    @Resource
    private ContractSignListDao contractSignListDao;

    @Resource
    private ContractInfoMapper contractInfoMapper;

    @Override
    public PageInfo<ContractInfoDTO> findAll(PageRequest<ContractInfoSearchDTO> page) {
        final PageInfo<ContractInfoDTO> result = new PageInfo<>();
        final List<ContractInfo> doList = contractInfoDao.findByParam(page.getCondition());
        result.setTotal(doList.size());
        result.setPageSize(10);
        result.setList(contractInfoMapper.doList2dtoListBase(doList));
        return result;
    }

    /**
     * 插入合同基本信息
     * @param contractInfoDTO
     * @return
     */
    @Override
    public Long insert(ContractInfoDTO contractInfoDTO) {
        final ContractInfo contractInfo = contractInfoMapper.dto2do(contractInfoDTO);
        contractInfo.setSerialNo(SerialNoGenerator.generateSerialNo("C",7));
        Date nowDate = new Date();
        contractInfo.setGmtCreate(nowDate);
        contractInfo.setGmtModify(nowDate);
        return contractInfoDao.insert(contractInfo);
    }

    /**
     * 修改合同基本信息
     * @param contractInfoDTO
     * @return
     */
    @Override
    public void update(ContractInfoDTO contractInfoDTO) {
        final ContractInfo contractInfo = contractInfoMapper.dto2do(contractInfoDTO);
        contractInfo.setGmtModify(new Date());
        contractInfoDao.update(contractInfo);
    }

    /**
     * 插入签署清单列表
     * @param  contractSerialNo
     * @param signListList
     */
    @Override
    public void insertSignList(String contractSerialNo, List<ContractSignListDTO> signListList) {
        contractSignListDao.deleteByContractSerialNo(contractSerialNo);
        final List<ContractSignList> contractSignLists = contractInfoMapper.dtoList2doListSign(signListList);
        contractSignLists.forEach(e -> {
            e.setContractSerialNo(contractSerialNo);
            e.setSerialNo(SerialNoGenerator.generateSerialNo("SL", 6));
            contractSignListDao.insert(e);
        });
    }
}