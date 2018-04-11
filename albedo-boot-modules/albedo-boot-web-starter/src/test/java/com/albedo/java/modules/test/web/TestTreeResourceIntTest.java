/**
 * Copyright &copy; 2018 <a href="https://github.com/somewhereMrli/albedo-boot">albedo-boot</a> All rights reserved.
 */
package com.albedo.java.modules.test.web;

import com.albedo.java.common.config.AlbedoProperties;
import com.albedo.java.common.persistence.DynamicSpecifications;
import com.albedo.java.common.persistence.SpecificationDetail;
import com.albedo.java.common.persistence.domain.BaseEntity;
import com.albedo.java.modules.test.domain.TestTree;
import com.albedo.java.modules.test.domain.vo.TestTreeVo;
import com.albedo.java.modules.test.repository.TestTreeRepository;
import com.albedo.java.modules.test.service.TestTreeService;
import com.albedo.java.modules.test.web.TestTreeResource;
import com.albedo.java.util.Json;
import com.albedo.java.util.base.Encodes;
import com.albedo.java.util.base.Reflections;
import com.albedo.java.util.PublicUtil;
import com.albedo.java.util.DateUtil;
import com.albedo.java.util.config.SystemConfig;
import com.albedo.java.util.domain.QueryCondition;
import com.albedo.java.web.rest.ExceptionTranslator;
import com.albedo.java.web.rest.TestUtil;
import com.google.common.collect.Lists;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.util.Date;
import java.util.List;

import static com.albedo.java.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the TestTreeResource REST controller.
 *
 * @see TestTreeResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = com.albedo.java.AlbedoBootWebApp.class)
public class TestTreeResourceIntTest {

    private String DEFAULT_API_URL;
	/** DEFAULT_NAME name_  :  name_ */
	private static final String DEFAULT_NAME = "A";
	/** UPDATED_NAME name_  :  name_ */
    private static final String UPDATED_NAME = "B";
	/** DEFAULT_PARENTID parent_id  :  上级节点 */
	private static final String DEFAULT_PARENTID = "A";
	/** UPDATED_PARENTID parent_id  :  上级节点 */
    private static final String UPDATED_PARENTID = "B";
	/** DEFAULT_CODE code_  :  机构编码 */
	private static final String DEFAULT_CODE = "A";
	/** UPDATED_CODE code_  :  机构编码 */
    private static final String UPDATED_CODE = "B";
	/** DEFAULT_GRADE grade_  :  机构等级 */
	private static final String DEFAULT_GRADE = "A";
	/** UPDATED_GRADE grade_  :  机构等级 */
    private static final String UPDATED_GRADE = "B";
	/** DEFAULT_EN en_  :  英文 */
	private static final String DEFAULT_EN = "A";
	/** UPDATED_EN en_  :  英文 */
    private static final String UPDATED_EN = "B";
	/** DEFAULT_SORT sort_  :  序号 */
	private static final int DEFAULT_SORT = 0;
	/** UPDATED_SORT sort_  :  序号 */
    private static final int UPDATED_SORT = 1;
	/** DEFAULT_TYPE type_  :  组织类型 */
	private static final String DEFAULT_TYPE = "A";
	/** UPDATED_TYPE type_  :  组织类型 */
    private static final String UPDATED_TYPE = "B";
	/** DEFAULT_DEFAULTDATA default_data  :  默认日期 */
	private static final Date DEFAULT_DEFAULTDATA = PublicUtil.parseDate(PublicUtil.fmtDate(PublicUtil.getCurrentDate()));
	/** UPDATED_DEFAULTDATA default_data  :  默认日期 */
    private static final Date UPDATED_DEFAULTDATA = DateUtil.addDays(DEFAULT_DEFAULTDATA, 1);
	/** DEFAULT_DESCRIPTION description_  :  description_ */
	private static final String DEFAULT_DESCRIPTION = "A";
	/** UPDATED_DESCRIPTION description_  :  description_ */
    private static final String UPDATED_DESCRIPTION = "B";

    @Autowired
    private TestTreeRepository testTreeRepository;

    @Autowired
    private TestTreeService testTreeService;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    @Autowired
    private AlbedoProperties albedoProperties;

    private MockMvc restTestTreeMockMvc;

    private TestTree testTree;

    @Before
    public void setup() {
        DEFAULT_API_URL = albedoProperties.getAdminPath("/test/testTree/");
        MockitoAnnotations.initMocks(this);
        final TestTreeResource testTreeResource = new TestTreeResource(testTreeService);
        this.restTestTreeMockMvc = MockMvcBuilders.standaloneSetup(testTreeResource)
            .addPlaceholderValue("albedo.adminPath", albedoProperties.getAdminPath())
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter)
            .build();
        SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
        securityContext.setAuthentication(new UsernamePasswordAuthenticationToken("admin", "111111"));
        SecurityContextHolder.setContext(securityContext);
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TestTree createEntity(EntityManager em) {
        TestTree testTree = Reflections.createObj(TestTree.class, Lists.newArrayList(
		 TestTree.F_NAME
		,TestTree.F_PARENTID
		,TestTree.F_CODE
		,TestTree.F_GRADE
		,TestTree.F_EN
		,TestTree.F_SORT
		,TestTree.F_TYPE
		,TestTree.F_DEFAULTDATA
		,TestTree.F_DESCRIPTION
        ), 
	
		 DEFAULT_NAME
	
		,DEFAULT_PARENTID
	
	
		,DEFAULT_CODE
	
		,DEFAULT_GRADE
	
	
		,DEFAULT_EN
	
		,DEFAULT_SORT
	
		,DEFAULT_TYPE
	
	
		,DEFAULT_DEFAULTDATA
	
	
	
	
	
	
		,DEFAULT_DESCRIPTION
	);
        return testTree;
    }

    @Before
    public void initTest() {
        testTree = createEntity(em);
    }

    @Test
    @Transactional
    public void createTestTree() throws Exception {
        int databaseSizeBeforeCreate = testTreeRepository.findAll().size();
        TestTreeVo testTreeVo = testTreeService.copyBeanToVo(testTree);
        // Create the TestTree
        restTestTreeMockMvc.perform(post(DEFAULT_API_URL)
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(testTreeVo)))
            .andExpect(status().isOk());
        ;
        // Validate the TestTree in the database
        List<TestTree> testTreeList = testTreeRepository.findAll(new Sort(Sort.Direction.ASC, TestTree.F_CREATEDDATE));
        assertThat(testTreeList).hasSize(databaseSizeBeforeCreate + 1);
        TestTree testTestTree = testTreeList.get(testTreeList.size() - 1);
		assertThat(testTestTree.getName()).isEqualTo(DEFAULT_NAME);
		assertThat(testTestTree.getParentId()).isEqualTo(DEFAULT_PARENTID);
		assertThat(testTestTree.getCode()).isEqualTo(DEFAULT_CODE);
		assertThat(testTestTree.getGrade()).isEqualTo(DEFAULT_GRADE);
		assertThat(testTestTree.getEn()).isEqualTo(DEFAULT_EN);
		assertThat(testTestTree.getSort()).isEqualTo(DEFAULT_SORT);
		assertThat(testTestTree.getType()).isEqualTo(DEFAULT_TYPE);
		assertThat(testTestTree.getDefaultData()).isEqualTo(DEFAULT_DEFAULTDATA);
		assertThat(testTestTree.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }
    @Test
    @Transactional
    public void createTestTreeWithExistingName() throws Exception {
        testTreeRepository.saveAndFlush(testTree);
        int databaseSizeBeforeCreate = testTreeRepository.findAll().size();

        // Create the TestTree with an existing ID
        TestTreeVo testTreeVo = Reflections.createObj(TestTreeVo.class, Lists.newArrayList(TestTreeVo.F_ID, TestTreeVo.F_NAME),
            null, testTree.getName());

        // An entity with an existing ID cannot be created, so this API call must fail
        restTestTreeMockMvc.perform(post(DEFAULT_API_URL)
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(testTreeVo)))
            .andExpect(status().isBadRequest());

        // Validate the TestTree in the database
        List<TestTree> testTreeList = testTreeRepository.findAll();
        assertThat(testTreeList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkCodeIsRequired() throws Exception {
        int databaseSizeBeforeTest = testTreeRepository.findAll().size();
        // set the field null
        testTree.setCode(null);

        // Create the TestTree, which fails.

        restTestTreeMockMvc.perform(post(DEFAULT_API_URL)
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(testTree)))
            .andExpect(status().isBadRequest());

        List<TestTree> testTreeList = testTreeRepository.findAll();
        assertThat(testTreeList).hasSize(databaseSizeBeforeTest);
    }
    @Test
    @Transactional
    public void checkGradeIsRequired() throws Exception {
        int databaseSizeBeforeTest = testTreeRepository.findAll().size();
        // set the field null
        testTree.setGrade(null);

        // Create the TestTree, which fails.

        restTestTreeMockMvc.perform(post(DEFAULT_API_URL)
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(testTree)))
            .andExpect(status().isBadRequest());

        List<TestTree> testTreeList = testTreeRepository.findAll();
        assertThat(testTreeList).hasSize(databaseSizeBeforeTest);
    }
    @Test
    @Transactional
    public void checkDefaultDataIsRequired() throws Exception {
        int databaseSizeBeforeTest = testTreeRepository.findAll().size();
        // set the field null
        testTree.setDefaultData(null);

        // Create the TestTree, which fails.

        restTestTreeMockMvc.perform(post(DEFAULT_API_URL)
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(testTree)))
            .andExpect(status().isBadRequest());

        List<TestTree> testTreeList = testTreeRepository.findAll();
        assertThat(testTreeList).hasSize(databaseSizeBeforeTest);
    }


    @Test
    @Transactional
    public void getAllTestTrees() throws Exception {
        // Initialize the database
        testTreeRepository.saveAndFlush(testTree);

        // Get all the testTreeList
        restTestTreeMockMvc.perform(get(DEFAULT_API_URL))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.data.[*].id").value(hasItem(testTree.getId())))
                                        .andExpect(jsonPath("$.data.[*].en").value(hasItem(DEFAULT_EN)))
                    .andExpect(jsonPath("$.data.[*].type").value(hasItem(DEFAULT_TYPE)))
                                            .andExpect(jsonPath("$.data.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
    ;
    }

    @Test
    @Transactional
    public void getTestTree() throws Exception {
        // Initialize the database
        testTreeRepository.saveAndFlush(testTree);

        // Get the testTree
        restTestTreeMockMvc.perform(get(DEFAULT_API_URL+"{id}", testTree.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.data.id").value(testTree.getId()))
                                        .andExpect(jsonPath("$.data.en").value(DEFAULT_EN))
                    .andExpect(jsonPath("$.data.type").value(DEFAULT_TYPE))
                                            .andExpect(jsonPath("$.data.description").value(DEFAULT_DESCRIPTION))
    ;
    }
    @Test
    @Transactional
    public void getAllTestTreesByNameIsEqualToSomething() throws Exception {
        // Initialize the database
        testTreeRepository.saveAndFlush(testTree);

        // Get all the testTreeList where name equals to DEFAULT_NAME
        defaultTestTreeShouldBeFound(QueryCondition.eq(TestTree.F_ID, testTree.getId()),
        QueryCondition.eq(TestTree.F_NAME, DEFAULT_NAME)
        );

        // Get all the testTreeList where name equals to UPDATED_NAME
        defaultTestTreeShouldNotBeFound(QueryCondition.eq(TestTree.F_ID, testTree.getId()),
        QueryCondition.eq(TestTree.F_NAME, UPDATED_NAME)
        );
    }

    @Test
    @Transactional
    public void getAllTestTreesByNameIsInShouldWork() throws Exception {
        // Initialize the database
        testTreeRepository.saveAndFlush(testTree);

        // Get all the testTreeList where name in DEFAULT_NAME or UPDATED_NAME
        defaultTestTreeShouldBeFound(QueryCondition.eq(TestTree.F_ID, testTree.getId()),
         QueryCondition.in(TestTree.F_NAME, Lists.newArrayList(DEFAULT_NAME, DEFAULT_NAME))
        );

        // Get all the testTreeList where name equals to UPDATED_NAME
        defaultTestTreeShouldNotBeFound(QueryCondition.eq(TestTree.F_ID, testTree.getId()),
         QueryCondition.in(TestTree.F_NAME, Lists.newArrayList(UPDATED_NAME))
        );
    }

    @Test
    @Transactional
    public void getAllTestTreesByNameIsNullOrNotNull() throws Exception {
        // Initialize the database
        testTreeRepository.saveAndFlush(testTree);

        // Get all the testTreeList where name is not null
        defaultTestTreeShouldBeFound(QueryCondition.eq(TestTree.F_ID, testTree.getId()), QueryCondition.isNotNull(TestTree.F_NAME));

        // Get all the testTreeList where name is null
        defaultTestTreeShouldNotBeFound(QueryCondition.eq(TestTree.F_ID, testTree.getId()), QueryCondition.isNull(TestTree.F_NAME));
    }
    @Test
    @Transactional
    public void getAllTestTreesByEnIsEqualToSomething() throws Exception {
        // Initialize the database
        testTreeRepository.saveAndFlush(testTree);

        // Get all the testTreeList where en equals to DEFAULT_EN
        defaultTestTreeShouldBeFound(QueryCondition.eq(TestTree.F_ID, testTree.getId()),
        QueryCondition.eq(TestTree.F_EN, DEFAULT_EN)
        );

        // Get all the testTreeList where en equals to UPDATED_EN
        defaultTestTreeShouldNotBeFound(QueryCondition.eq(TestTree.F_ID, testTree.getId()),
        QueryCondition.eq(TestTree.F_EN, UPDATED_EN)
        );
    }

    @Test
    @Transactional
    public void getAllTestTreesByEnIsInShouldWork() throws Exception {
        // Initialize the database
        testTreeRepository.saveAndFlush(testTree);

        // Get all the testTreeList where en in DEFAULT_EN or UPDATED_EN
        defaultTestTreeShouldBeFound(QueryCondition.eq(TestTree.F_ID, testTree.getId()),
         QueryCondition.in(TestTree.F_EN, Lists.newArrayList(DEFAULT_EN, DEFAULT_EN))
        );

        // Get all the testTreeList where en equals to UPDATED_EN
        defaultTestTreeShouldNotBeFound(QueryCondition.eq(TestTree.F_ID, testTree.getId()),
         QueryCondition.in(TestTree.F_EN, Lists.newArrayList(UPDATED_EN))
        );
    }

    @Test
    @Transactional
    public void getAllTestTreesByEnIsNullOrNotNull() throws Exception {
        // Initialize the database
        testTreeRepository.saveAndFlush(testTree);

        // Get all the testTreeList where en is not null
        defaultTestTreeShouldBeFound(QueryCondition.eq(TestTree.F_ID, testTree.getId()), QueryCondition.isNotNull(TestTree.F_EN));

        // Get all the testTreeList where en is null
        defaultTestTreeShouldNotBeFound(QueryCondition.eq(TestTree.F_ID, testTree.getId()), QueryCondition.isNull(TestTree.F_EN));
    }
    @Test
    @Transactional
    public void getAllTestTreesBySortIsEqualToSomething() throws Exception {
        // Initialize the database
        testTreeRepository.saveAndFlush(testTree);

        // Get all the testTreeList where sort equals to DEFAULT_SORT
        defaultTestTreeShouldBeFound(QueryCondition.eq(TestTree.F_ID, testTree.getId()),
        QueryCondition.eq(TestTree.F_SORT, DEFAULT_SORT)
        );

        // Get all the testTreeList where sort equals to UPDATED_SORT
        defaultTestTreeShouldNotBeFound(QueryCondition.eq(TestTree.F_ID, testTree.getId()),
        QueryCondition.eq(TestTree.F_SORT, UPDATED_SORT)
        );
    }

    @Test
    @Transactional
    public void getAllTestTreesBySortIsInShouldWork() throws Exception {
        // Initialize the database
        testTreeRepository.saveAndFlush(testTree);

        // Get all the testTreeList where sort in DEFAULT_SORT or UPDATED_SORT
        defaultTestTreeShouldBeFound(QueryCondition.eq(TestTree.F_ID, testTree.getId()),
         QueryCondition.in(TestTree.F_SORT, Lists.newArrayList(DEFAULT_SORT, DEFAULT_SORT))
        );

        // Get all the testTreeList where sort equals to UPDATED_SORT
        defaultTestTreeShouldNotBeFound(QueryCondition.eq(TestTree.F_ID, testTree.getId()),
         QueryCondition.in(TestTree.F_SORT, Lists.newArrayList(UPDATED_SORT))
        );
    }

    @Test
    @Transactional
    public void getAllTestTreesBySortIsNullOrNotNull() throws Exception {
        // Initialize the database
        testTreeRepository.saveAndFlush(testTree);

        // Get all the testTreeList where sort is not null
        defaultTestTreeShouldBeFound(QueryCondition.eq(TestTree.F_ID, testTree.getId()), QueryCondition.isNotNull(TestTree.F_SORT));

        // Get all the testTreeList where sort is null
        defaultTestTreeShouldNotBeFound(QueryCondition.eq(TestTree.F_ID, testTree.getId()), QueryCondition.isNull(TestTree.F_SORT));
    }
    @Test
    @Transactional
    public void getAllTestTreesByTypeIsEqualToSomething() throws Exception {
        // Initialize the database
        testTreeRepository.saveAndFlush(testTree);

        // Get all the testTreeList where type equals to DEFAULT_TYPE
        defaultTestTreeShouldBeFound(QueryCondition.eq(TestTree.F_ID, testTree.getId()),
        QueryCondition.eq(TestTree.F_TYPE, DEFAULT_TYPE)
        );

        // Get all the testTreeList where type equals to UPDATED_TYPE
        defaultTestTreeShouldNotBeFound(QueryCondition.eq(TestTree.F_ID, testTree.getId()),
        QueryCondition.eq(TestTree.F_TYPE, UPDATED_TYPE)
        );
    }

    @Test
    @Transactional
    public void getAllTestTreesByTypeIsInShouldWork() throws Exception {
        // Initialize the database
        testTreeRepository.saveAndFlush(testTree);

        // Get all the testTreeList where type in DEFAULT_TYPE or UPDATED_TYPE
        defaultTestTreeShouldBeFound(QueryCondition.eq(TestTree.F_ID, testTree.getId()),
         QueryCondition.in(TestTree.F_TYPE, Lists.newArrayList(DEFAULT_TYPE, DEFAULT_TYPE))
        );

        // Get all the testTreeList where type equals to UPDATED_TYPE
        defaultTestTreeShouldNotBeFound(QueryCondition.eq(TestTree.F_ID, testTree.getId()),
         QueryCondition.in(TestTree.F_TYPE, Lists.newArrayList(UPDATED_TYPE))
        );
    }

    @Test
    @Transactional
    public void getAllTestTreesByTypeIsNullOrNotNull() throws Exception {
        // Initialize the database
        testTreeRepository.saveAndFlush(testTree);

        // Get all the testTreeList where type is not null
        defaultTestTreeShouldBeFound(QueryCondition.eq(TestTree.F_ID, testTree.getId()), QueryCondition.isNotNull(TestTree.F_TYPE));

        // Get all the testTreeList where type is null
        defaultTestTreeShouldNotBeFound(QueryCondition.eq(TestTree.F_ID, testTree.getId()), QueryCondition.isNull(TestTree.F_TYPE));
    }
    @Test
    @Transactional
    public void getAllTestTreesByDescriptionIsEqualToSomething() throws Exception {
        // Initialize the database
        testTreeRepository.saveAndFlush(testTree);

        // Get all the testTreeList where description equals to DEFAULT_DESCRIPTION
        defaultTestTreeShouldBeFound(QueryCondition.eq(TestTree.F_ID, testTree.getId()),
        QueryCondition.eq(TestTree.F_DESCRIPTION, DEFAULT_DESCRIPTION)
        );

        // Get all the testTreeList where description equals to UPDATED_DESCRIPTION
        defaultTestTreeShouldNotBeFound(QueryCondition.eq(TestTree.F_ID, testTree.getId()),
        QueryCondition.eq(TestTree.F_DESCRIPTION, UPDATED_DESCRIPTION)
        );
    }

    @Test
    @Transactional
    public void getAllTestTreesByDescriptionIsInShouldWork() throws Exception {
        // Initialize the database
        testTreeRepository.saveAndFlush(testTree);

        // Get all the testTreeList where description in DEFAULT_DESCRIPTION or UPDATED_DESCRIPTION
        defaultTestTreeShouldBeFound(QueryCondition.eq(TestTree.F_ID, testTree.getId()),
         QueryCondition.in(TestTree.F_DESCRIPTION, Lists.newArrayList(DEFAULT_DESCRIPTION, DEFAULT_DESCRIPTION))
        );

        // Get all the testTreeList where description equals to UPDATED_DESCRIPTION
        defaultTestTreeShouldNotBeFound(QueryCondition.eq(TestTree.F_ID, testTree.getId()),
         QueryCondition.in(TestTree.F_DESCRIPTION, Lists.newArrayList(UPDATED_DESCRIPTION))
        );
    }

    @Test
    @Transactional
    public void getAllTestTreesByDescriptionIsNullOrNotNull() throws Exception {
        // Initialize the database
        testTreeRepository.saveAndFlush(testTree);

        // Get all the testTreeList where description is not null
        defaultTestTreeShouldBeFound(QueryCondition.eq(TestTree.F_ID, testTree.getId()), QueryCondition.isNotNull(TestTree.F_DESCRIPTION));

        // Get all the testTreeList where description is null
        defaultTestTreeShouldNotBeFound(QueryCondition.eq(TestTree.F_ID, testTree.getId()), QueryCondition.isNull(TestTree.F_DESCRIPTION));
    }

    /**
     * Executes the search, and checks that the default entity is returned
     */
    private void defaultTestTreeShouldBeFound(QueryCondition... queryCondition) throws Exception {
        restTestTreeMockMvc.perform(get(DEFAULT_API_URL).param("queryConditionJson", Json.toJSONString(Lists.newArrayList(queryCondition))))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.data").isArray())
            .andExpect(jsonPath("$.data.[*].id").value(hasItem(testTree.getId())))
                                        .andExpect(jsonPath("$.data.[*].en").value(hasItem(DEFAULT_EN)))
                    .andExpect(jsonPath("$.data.[*].type").value(hasItem(DEFAULT_TYPE)))
                                            .andExpect(jsonPath("$.data.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
    ;
    }

    /**
     * Executes the search, and checks that the default entity is not returned
     */
    private void defaultTestTreeShouldNotBeFound(QueryCondition... queryCondition) throws Exception {
        restTestTreeMockMvc.perform(get(DEFAULT_API_URL).param("queryConditionJson", Json.toJSONString(Lists.newArrayList(queryCondition))))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.data").isArray())
            .andExpect(jsonPath("$.data").isEmpty());
    }


    @Test
    @Transactional
    public void getNonExistingTestTree() throws Exception {
        // Get the testTree
        restTestTreeMockMvc.perform(get(DEFAULT_API_URL+"{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateTestTree() throws Exception {
        // Initialize the database
        testTreeService.save(testTree);

        int databaseSizeBeforeUpdate = testTreeRepository.findAll().size();

        // Update the testTree
        TestTree updatedTestTree = testTreeRepository.findOne(testTree.getId());
        // Disconnect from session so that the updates on updatedTestTree are not directly saved in db
        em.detach(updatedTestTree);
        Reflections.updateObj(updatedTestTree, Lists.newArrayList(
		 TestTree.F_NAME
		,TestTree.F_PARENTID
		,TestTree.F_CODE
		,TestTree.F_GRADE
		,TestTree.F_EN
		,TestTree.F_SORT
		,TestTree.F_TYPE
		,TestTree.F_DEFAULTDATA
		,TestTree.F_DESCRIPTION
        ), 
	
		 UPDATED_NAME
	
		,UPDATED_PARENTID
	
	
		,UPDATED_CODE
	
		,UPDATED_GRADE
	
	
		,UPDATED_EN
	
		,UPDATED_SORT
	
		,UPDATED_TYPE
	
	
		,UPDATED_DEFAULTDATA
	
	
	
	
	
	
		,UPDATED_DESCRIPTION
	);

        TestTreeVo testTreeVo = testTreeService.copyBeanToVo(updatedTestTree);
        restTestTreeMockMvc.perform(post(DEFAULT_API_URL)
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(testTreeVo)))
            .andExpect(status().isOk());

        // Validate the TestTree in the database
        List<TestTree> testTreeList = testTreeRepository.findAll();
        assertThat(testTreeList).hasSize(databaseSizeBeforeUpdate);

        TestTree testTestTree = testTreeList.stream().filter(item->testTree.getId().equals(item.getId())).findAny().get();
		assertThat(testTestTree.getName()).isEqualTo(UPDATED_NAME);
		assertThat(testTestTree.getParentId()).isEqualTo(UPDATED_PARENTID);
		assertThat(testTestTree.getCode()).isEqualTo(UPDATED_CODE);
		assertThat(testTestTree.getGrade()).isEqualTo(UPDATED_GRADE);
		assertThat(testTestTree.getEn()).isEqualTo(UPDATED_EN);
		assertThat(testTestTree.getSort()).isEqualTo(UPDATED_SORT);
		assertThat(testTestTree.getType()).isEqualTo(UPDATED_TYPE);
		assertThat(testTestTree.getDefaultData()).isEqualTo(UPDATED_DEFAULTDATA);
		assertThat(testTestTree.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }


    @Test
    @Transactional
    public void deleteTestTree() throws Exception {
        // Initialize the database
        testTreeService.save(testTree);
        SpecificationDetail<TestTree> spec = DynamicSpecifications.bySearchQueryCondition(
            QueryCondition.ne(BaseEntity.F_STATUS, BaseEntity.FLAG_DELETE));
        int databaseSizeBeforeDelete = testTreeRepository.findAll(spec).size();

        // Get the testTree
        restTestTreeMockMvc.perform(delete(DEFAULT_API_URL+"{id}", testTree.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<TestTree> testTreeList = testTreeRepository.findAll(spec);
        assertThat(testTreeList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(TestTree.class);
        TestTree testTree1 = new TestTree();
        testTree1.setId("id1");
        TestTree testTree2 = new TestTree();
        testTree2.setId(testTree1.getId());
        assertThat(testTree1).isEqualTo(testTree2);
        testTree2.setId("id2");
        assertThat(testTree1).isNotEqualTo(testTree2);
        testTree1.setId(null);
        assertThat(testTree1).isNotEqualTo(testTree2);
    }

}