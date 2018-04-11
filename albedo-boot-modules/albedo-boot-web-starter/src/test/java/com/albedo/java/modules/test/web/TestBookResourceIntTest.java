/**
 * Copyright &copy; 2018 <a href="https://github.com/somewhereMrli/albedo-boot">albedo-boot</a> All rights reserved.
 */
package com.albedo.java.modules.test.web;

import com.albedo.java.common.config.AlbedoProperties;
import com.albedo.java.common.persistence.DynamicSpecifications;
import com.albedo.java.common.persistence.SpecificationDetail;
import com.albedo.java.common.persistence.domain.BaseEntity;
import com.albedo.java.modules.test.domain.TestBook;
import com.albedo.java.modules.test.domain.vo.TestBookVo;
import com.albedo.java.modules.test.repository.TestBookRepository;
import com.albedo.java.modules.test.service.TestBookService;
import com.albedo.java.modules.test.web.TestBookResource;
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
 * Test class for the TestBookResource REST controller.
 *
 * @see TestBookResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = com.albedo.java.AlbedoBootWebApp.class)
public class TestBookResourceIntTest {

    private String DEFAULT_API_URL;
	/** DEFAULT_TITLE title_  :  标题 */
	private static final String DEFAULT_TITLE = "A";
	/** UPDATED_TITLE title_  :  标题 */
    private static final String UPDATED_TITLE = "B";
	/** DEFAULT_AUTHOR author_  :  作者 */
	private static final String DEFAULT_AUTHOR = "A";
	/** UPDATED_AUTHOR author_  :  作者 */
    private static final String UPDATED_AUTHOR = "B";
	/** DEFAULT_NAME name_  :  名称 */
	private static final String DEFAULT_NAME = "A";
	/** UPDATED_NAME name_  :  名称 */
    private static final String UPDATED_NAME = "B";
	/** DEFAULT_EMAIL email_  :  邮箱 */
	private static final String DEFAULT_EMAIL = "1@albedo.com";
	/** UPDATED_EMAIL email_  :  邮箱 */
    private static final String UPDATED_EMAIL = "2@albedo.com";
	/** DEFAULT_PHONE phone_  :  手机 */
	private static final String DEFAULT_PHONE = "A";
	/** UPDATED_PHONE phone_  :  手机 */
    private static final String UPDATED_PHONE = "B";
	/** DEFAULT_ACTIVATED activated_  :  activated_ */
	private static final int DEFAULT_ACTIVATED = 0;
	/** UPDATED_ACTIVATED activated_  :  activated_ */
    private static final int UPDATED_ACTIVATED = 1;
	/** DEFAULT_LANGKEY lang_key  :  key */
	private static final String DEFAULT_LANGKEY = "A";
	/** UPDATED_LANGKEY lang_key  :  key */
    private static final String UPDATED_LANGKEY = "B";
	/** DEFAULT_ACTIVATIONKEY activation_key  :  activation_key */
	private static final String DEFAULT_ACTIVATIONKEY = "A";
	/** UPDATED_ACTIVATIONKEY activation_key  :  activation_key */
    private static final String UPDATED_ACTIVATIONKEY = "B";
	/** DEFAULT_RESETKEY reset_key  :  reset_key */
	private static final String DEFAULT_RESETKEY = "A";
	/** UPDATED_RESETKEY reset_key  :  reset_key */
    private static final String UPDATED_RESETKEY = "B";
	/** DEFAULT_RESETDATE reset_date  :  reset_date */
	private static final Date DEFAULT_RESETDATE = PublicUtil.parseDate(PublicUtil.fmtDate(PublicUtil.getCurrentDate()));
	/** UPDATED_RESETDATE reset_date  :  reset_date */
    private static final Date UPDATED_RESETDATE = DateUtil.addDays(DEFAULT_RESETDATE, 1);
	/** DEFAULT_DESCRIPTION description_  :  description_ */
	private static final String DEFAULT_DESCRIPTION = "A";
	/** UPDATED_DESCRIPTION description_  :  description_ */
    private static final String UPDATED_DESCRIPTION = "B";

    @Autowired
    private TestBookRepository testBookRepository;

    @Autowired
    private TestBookService testBookService;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    @Autowired
    private AlbedoProperties albedoProperties;

    private MockMvc restTestBookMockMvc;

    private TestBook testBook;

    @Before
    public void setup() {
        DEFAULT_API_URL = albedoProperties.getAdminPath("/test/testBook/");
        MockitoAnnotations.initMocks(this);
        final TestBookResource testBookResource = new TestBookResource(testBookService);
        this.restTestBookMockMvc = MockMvcBuilders.standaloneSetup(testBookResource)
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
    public static TestBook createEntity(EntityManager em) {
        TestBook testBook = Reflections.createObj(TestBook.class, Lists.newArrayList(
		 TestBook.F_TITLE
		,TestBook.F_AUTHOR
		,TestBook.F_NAME
		,TestBook.F_EMAIL
		,TestBook.F_PHONE
		,TestBook.F_ACTIVATED
		,TestBook.F_LANGKEY
		,TestBook.F_ACTIVATIONKEY
		,TestBook.F_RESETKEY
		,TestBook.F_RESETDATE
		,TestBook.F_DESCRIPTION
        ), 
	
		 DEFAULT_TITLE
	
		,DEFAULT_AUTHOR
	
		,DEFAULT_NAME
	
		,DEFAULT_EMAIL
	
		,DEFAULT_PHONE
	
		,DEFAULT_ACTIVATED
	
		,DEFAULT_LANGKEY
	
		,DEFAULT_ACTIVATIONKEY
	
		,DEFAULT_RESETKEY
	
		,DEFAULT_RESETDATE
	
	
	
	
	
	
		,DEFAULT_DESCRIPTION
	
	);
        return testBook;
    }

    @Before
    public void initTest() {
        testBook = createEntity(em);
    }

    @Test
    @Transactional
    public void createTestBook() throws Exception {
        int databaseSizeBeforeCreate = testBookRepository.findAll().size();
        TestBookVo testBookVo = testBookService.copyBeanToVo(testBook);
        // Create the TestBook
        restTestBookMockMvc.perform(post(DEFAULT_API_URL)
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(testBookVo)))
            .andExpect(status().isOk());
        ;
        // Validate the TestBook in the database
        List<TestBook> testBookList = testBookRepository.findAll(new Sort(Sort.Direction.ASC, TestBook.F_CREATEDDATE));
        assertThat(testBookList).hasSize(databaseSizeBeforeCreate + 1);
        TestBook testTestBook = testBookList.get(testBookList.size() - 1);
		assertThat(testTestBook.getTitle()).isEqualTo(DEFAULT_TITLE);
		assertThat(testTestBook.getAuthor()).isEqualTo(DEFAULT_AUTHOR);
		assertThat(testTestBook.getName()).isEqualTo(DEFAULT_NAME);
		assertThat(testTestBook.getEmail()).isEqualTo(DEFAULT_EMAIL);
		assertThat(testTestBook.getPhone()).isEqualTo(DEFAULT_PHONE);
		assertThat(testTestBook.getActivated()).isEqualTo(DEFAULT_ACTIVATED);
		assertThat(testTestBook.getLangKey()).isEqualTo(DEFAULT_LANGKEY);
		assertThat(testTestBook.getActivationKey()).isEqualTo(DEFAULT_ACTIVATIONKEY);
		assertThat(testTestBook.getResetKey()).isEqualTo(DEFAULT_RESETKEY);
		assertThat(testTestBook.getResetDate()).isEqualTo(DEFAULT_RESETDATE);
		assertThat(testTestBook.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }
    @Test
    @Transactional
    public void createTestBookWithExistingEmail() throws Exception {
        testBookRepository.saveAndFlush(testBook);
        int databaseSizeBeforeCreate = testBookRepository.findAll().size();

        // Create the TestBook with an existing ID
        TestBookVo testBookVo = Reflections.createObj(TestBookVo.class, Lists.newArrayList(TestBookVo.F_ID, TestBookVo.F_EMAIL),
            null, testBook.getEmail());

        // An entity with an existing ID cannot be created, so this API call must fail
        restTestBookMockMvc.perform(post(DEFAULT_API_URL)
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(testBookVo)))
            .andExpect(status().isBadRequest());

        // Validate the TestBook in the database
        List<TestBook> testBookList = testBookRepository.findAll();
        assertThat(testBookList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkAuthorIsRequired() throws Exception {
        int databaseSizeBeforeTest = testBookRepository.findAll().size();
        // set the field null
        testBook.setAuthor(null);

        // Create the TestBook, which fails.

        restTestBookMockMvc.perform(post(DEFAULT_API_URL)
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(testBook)))
            .andExpect(status().isBadRequest());

        List<TestBook> testBookList = testBookRepository.findAll();
        assertThat(testBookList).hasSize(databaseSizeBeforeTest);
    }
    @Test
    @Transactional
    public void checkActivatedIsRequired() throws Exception {
        int databaseSizeBeforeTest = testBookRepository.findAll().size();
        // set the field null
        testBook.setActivated(null);

        // Create the TestBook, which fails.

        restTestBookMockMvc.perform(post(DEFAULT_API_URL)
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(testBook)))
            .andExpect(status().isBadRequest());

        List<TestBook> testBookList = testBookRepository.findAll();
        assertThat(testBookList).hasSize(databaseSizeBeforeTest);
    }


    @Test
    @Transactional
    public void getAllTestBooks() throws Exception {
        // Initialize the database
        testBookRepository.saveAndFlush(testBook);

        // Get all the testBookList
        restTestBookMockMvc.perform(get(DEFAULT_API_URL))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.data.[*].id").value(hasItem(testBook.getId())))
                .andExpect(jsonPath("$.data.[*].title").value(hasItem(DEFAULT_TITLE)))
                    .andExpect(jsonPath("$.data.[*].name").value(hasItem(DEFAULT_NAME)))
                .andExpect(jsonPath("$.data.[*].email").value(hasItem(DEFAULT_EMAIL)))
                .andExpect(jsonPath("$.data.[*].phone").value(hasItem(DEFAULT_PHONE)))
                    .andExpect(jsonPath("$.data.[*].langKey").value(hasItem(DEFAULT_LANGKEY)))
                .andExpect(jsonPath("$.data.[*].activationKey").value(hasItem(DEFAULT_ACTIVATIONKEY)))
                .andExpect(jsonPath("$.data.[*].resetKey").value(hasItem(DEFAULT_RESETKEY)))
                .andExpect(jsonPath("$.data.[*].resetDate").value(hasItem(PublicUtil.fmtDate(DEFAULT_RESETDATE))))
                                    .andExpect(jsonPath("$.data.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
        ;
    }

    @Test
    @Transactional
    public void getTestBook() throws Exception {
        // Initialize the database
        testBookRepository.saveAndFlush(testBook);

        // Get the testBook
        restTestBookMockMvc.perform(get(DEFAULT_API_URL+"{id}", testBook.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.data.id").value(testBook.getId()))
                .andExpect(jsonPath("$.data.title").value(DEFAULT_TITLE))
                    .andExpect(jsonPath("$.data.name").value(DEFAULT_NAME))
                .andExpect(jsonPath("$.data.email").value(DEFAULT_EMAIL))
                .andExpect(jsonPath("$.data.phone").value(DEFAULT_PHONE))
                    .andExpect(jsonPath("$.data.langKey").value(DEFAULT_LANGKEY))
                .andExpect(jsonPath("$.data.activationKey").value(DEFAULT_ACTIVATIONKEY))
                .andExpect(jsonPath("$.data.resetKey").value(DEFAULT_RESETKEY))
                .andExpect(jsonPath("$.data.resetDate").value(DEFAULT_RESETDATE.getTime()))
                                    .andExpect(jsonPath("$.data.description").value(DEFAULT_DESCRIPTION))
        ;
    }
    @Test
    @Transactional
    public void getAllTestBooksByTitleIsEqualToSomething() throws Exception {
        // Initialize the database
        testBookRepository.saveAndFlush(testBook);

        // Get all the testBookList where title equals to DEFAULT_TITLE
        defaultTestBookShouldBeFound(QueryCondition.eq(TestBook.F_ID, testBook.getId()),
        QueryCondition.eq(TestBook.F_TITLE, DEFAULT_TITLE)
        );

        // Get all the testBookList where title equals to UPDATED_TITLE
        defaultTestBookShouldNotBeFound(QueryCondition.eq(TestBook.F_ID, testBook.getId()),
        QueryCondition.eq(TestBook.F_TITLE, UPDATED_TITLE)
        );
    }

    @Test
    @Transactional
    public void getAllTestBooksByTitleIsInShouldWork() throws Exception {
        // Initialize the database
        testBookRepository.saveAndFlush(testBook);

        // Get all the testBookList where title in DEFAULT_TITLE or UPDATED_TITLE
        defaultTestBookShouldBeFound(QueryCondition.eq(TestBook.F_ID, testBook.getId()),
         QueryCondition.in(TestBook.F_TITLE, Lists.newArrayList(DEFAULT_TITLE, DEFAULT_TITLE))
        );

        // Get all the testBookList where title equals to UPDATED_TITLE
        defaultTestBookShouldNotBeFound(QueryCondition.eq(TestBook.F_ID, testBook.getId()),
         QueryCondition.in(TestBook.F_TITLE, Lists.newArrayList(UPDATED_TITLE))
        );
    }

    @Test
    @Transactional
    public void getAllTestBooksByTitleIsNullOrNotNull() throws Exception {
        // Initialize the database
        testBookRepository.saveAndFlush(testBook);

        // Get all the testBookList where title is not null
        defaultTestBookShouldBeFound(QueryCondition.eq(TestBook.F_ID, testBook.getId()), QueryCondition.isNotNull(TestBook.F_TITLE));

        // Get all the testBookList where title is null
        defaultTestBookShouldNotBeFound(QueryCondition.eq(TestBook.F_ID, testBook.getId()), QueryCondition.isNull(TestBook.F_TITLE));
    }
    @Test
    @Transactional
    public void getAllTestBooksByNameIsEqualToSomething() throws Exception {
        // Initialize the database
        testBookRepository.saveAndFlush(testBook);

        // Get all the testBookList where name equals to DEFAULT_NAME
        defaultTestBookShouldBeFound(QueryCondition.eq(TestBook.F_ID, testBook.getId()),
        QueryCondition.eq(TestBook.F_NAME, DEFAULT_NAME)
        );

        // Get all the testBookList where name equals to UPDATED_NAME
        defaultTestBookShouldNotBeFound(QueryCondition.eq(TestBook.F_ID, testBook.getId()),
        QueryCondition.eq(TestBook.F_NAME, UPDATED_NAME)
        );
    }

    @Test
    @Transactional
    public void getAllTestBooksByNameIsInShouldWork() throws Exception {
        // Initialize the database
        testBookRepository.saveAndFlush(testBook);

        // Get all the testBookList where name in DEFAULT_NAME or UPDATED_NAME
        defaultTestBookShouldBeFound(QueryCondition.eq(TestBook.F_ID, testBook.getId()),
         QueryCondition.in(TestBook.F_NAME, Lists.newArrayList(DEFAULT_NAME, DEFAULT_NAME))
        );

        // Get all the testBookList where name equals to UPDATED_NAME
        defaultTestBookShouldNotBeFound(QueryCondition.eq(TestBook.F_ID, testBook.getId()),
         QueryCondition.in(TestBook.F_NAME, Lists.newArrayList(UPDATED_NAME))
        );
    }

    @Test
    @Transactional
    public void getAllTestBooksByNameIsNullOrNotNull() throws Exception {
        // Initialize the database
        testBookRepository.saveAndFlush(testBook);

        // Get all the testBookList where name is not null
        defaultTestBookShouldBeFound(QueryCondition.eq(TestBook.F_ID, testBook.getId()), QueryCondition.isNotNull(TestBook.F_NAME));

        // Get all the testBookList where name is null
        defaultTestBookShouldNotBeFound(QueryCondition.eq(TestBook.F_ID, testBook.getId()), QueryCondition.isNull(TestBook.F_NAME));
    }
    @Test
    @Transactional
    public void getAllTestBooksByEmailIsEqualToSomething() throws Exception {
        // Initialize the database
        testBookRepository.saveAndFlush(testBook);

        // Get all the testBookList where email equals to DEFAULT_EMAIL
        defaultTestBookShouldBeFound(QueryCondition.eq(TestBook.F_ID, testBook.getId()),
        QueryCondition.eq(TestBook.F_EMAIL, DEFAULT_EMAIL)
        );

        // Get all the testBookList where email equals to UPDATED_EMAIL
        defaultTestBookShouldNotBeFound(QueryCondition.eq(TestBook.F_ID, testBook.getId()),
        QueryCondition.eq(TestBook.F_EMAIL, UPDATED_EMAIL)
        );
    }

    @Test
    @Transactional
    public void getAllTestBooksByEmailIsInShouldWork() throws Exception {
        // Initialize the database
        testBookRepository.saveAndFlush(testBook);

        // Get all the testBookList where email in DEFAULT_EMAIL or UPDATED_EMAIL
        defaultTestBookShouldBeFound(QueryCondition.eq(TestBook.F_ID, testBook.getId()),
         QueryCondition.in(TestBook.F_EMAIL, Lists.newArrayList(DEFAULT_EMAIL, DEFAULT_EMAIL))
        );

        // Get all the testBookList where email equals to UPDATED_EMAIL
        defaultTestBookShouldNotBeFound(QueryCondition.eq(TestBook.F_ID, testBook.getId()),
         QueryCondition.in(TestBook.F_EMAIL, Lists.newArrayList(UPDATED_EMAIL))
        );
    }

    @Test
    @Transactional
    public void getAllTestBooksByEmailIsNullOrNotNull() throws Exception {
        // Initialize the database
        testBookRepository.saveAndFlush(testBook);

        // Get all the testBookList where email is not null
        defaultTestBookShouldBeFound(QueryCondition.eq(TestBook.F_ID, testBook.getId()), QueryCondition.isNotNull(TestBook.F_EMAIL));

        // Get all the testBookList where email is null
        defaultTestBookShouldNotBeFound(QueryCondition.eq(TestBook.F_ID, testBook.getId()), QueryCondition.isNull(TestBook.F_EMAIL));
    }
    @Test
    @Transactional
    public void getAllTestBooksByPhoneIsEqualToSomething() throws Exception {
        // Initialize the database
        testBookRepository.saveAndFlush(testBook);

        // Get all the testBookList where phone equals to DEFAULT_PHONE
        defaultTestBookShouldBeFound(QueryCondition.eq(TestBook.F_ID, testBook.getId()),
        QueryCondition.eq(TestBook.F_PHONE, DEFAULT_PHONE)
        );

        // Get all the testBookList where phone equals to UPDATED_PHONE
        defaultTestBookShouldNotBeFound(QueryCondition.eq(TestBook.F_ID, testBook.getId()),
        QueryCondition.eq(TestBook.F_PHONE, UPDATED_PHONE)
        );
    }

    @Test
    @Transactional
    public void getAllTestBooksByPhoneIsInShouldWork() throws Exception {
        // Initialize the database
        testBookRepository.saveAndFlush(testBook);

        // Get all the testBookList where phone in DEFAULT_PHONE or UPDATED_PHONE
        defaultTestBookShouldBeFound(QueryCondition.eq(TestBook.F_ID, testBook.getId()),
         QueryCondition.in(TestBook.F_PHONE, Lists.newArrayList(DEFAULT_PHONE, DEFAULT_PHONE))
        );

        // Get all the testBookList where phone equals to UPDATED_PHONE
        defaultTestBookShouldNotBeFound(QueryCondition.eq(TestBook.F_ID, testBook.getId()),
         QueryCondition.in(TestBook.F_PHONE, Lists.newArrayList(UPDATED_PHONE))
        );
    }

    @Test
    @Transactional
    public void getAllTestBooksByPhoneIsNullOrNotNull() throws Exception {
        // Initialize the database
        testBookRepository.saveAndFlush(testBook);

        // Get all the testBookList where phone is not null
        defaultTestBookShouldBeFound(QueryCondition.eq(TestBook.F_ID, testBook.getId()), QueryCondition.isNotNull(TestBook.F_PHONE));

        // Get all the testBookList where phone is null
        defaultTestBookShouldNotBeFound(QueryCondition.eq(TestBook.F_ID, testBook.getId()), QueryCondition.isNull(TestBook.F_PHONE));
    }
    @Test
    @Transactional
    public void getAllTestBooksByLangKeyIsEqualToSomething() throws Exception {
        // Initialize the database
        testBookRepository.saveAndFlush(testBook);

        // Get all the testBookList where langKey equals to DEFAULT_LANGKEY
        defaultTestBookShouldBeFound(QueryCondition.eq(TestBook.F_ID, testBook.getId()),
        QueryCondition.eq(TestBook.F_LANGKEY, DEFAULT_LANGKEY)
        );

        // Get all the testBookList where langKey equals to UPDATED_LANGKEY
        defaultTestBookShouldNotBeFound(QueryCondition.eq(TestBook.F_ID, testBook.getId()),
        QueryCondition.eq(TestBook.F_LANGKEY, UPDATED_LANGKEY)
        );
    }

    @Test
    @Transactional
    public void getAllTestBooksByLangKeyIsInShouldWork() throws Exception {
        // Initialize the database
        testBookRepository.saveAndFlush(testBook);

        // Get all the testBookList where langKey in DEFAULT_LANGKEY or UPDATED_LANGKEY
        defaultTestBookShouldBeFound(QueryCondition.eq(TestBook.F_ID, testBook.getId()),
         QueryCondition.in(TestBook.F_LANGKEY, Lists.newArrayList(DEFAULT_LANGKEY, DEFAULT_LANGKEY))
        );

        // Get all the testBookList where langKey equals to UPDATED_LANGKEY
        defaultTestBookShouldNotBeFound(QueryCondition.eq(TestBook.F_ID, testBook.getId()),
         QueryCondition.in(TestBook.F_LANGKEY, Lists.newArrayList(UPDATED_LANGKEY))
        );
    }

    @Test
    @Transactional
    public void getAllTestBooksByLangKeyIsNullOrNotNull() throws Exception {
        // Initialize the database
        testBookRepository.saveAndFlush(testBook);

        // Get all the testBookList where langKey is not null
        defaultTestBookShouldBeFound(QueryCondition.eq(TestBook.F_ID, testBook.getId()), QueryCondition.isNotNull(TestBook.F_LANGKEY));

        // Get all the testBookList where langKey is null
        defaultTestBookShouldNotBeFound(QueryCondition.eq(TestBook.F_ID, testBook.getId()), QueryCondition.isNull(TestBook.F_LANGKEY));
    }
    @Test
    @Transactional
    public void getAllTestBooksByActivationKeyIsEqualToSomething() throws Exception {
        // Initialize the database
        testBookRepository.saveAndFlush(testBook);

        // Get all the testBookList where activationKey equals to DEFAULT_ACTIVATIONKEY
        defaultTestBookShouldBeFound(QueryCondition.eq(TestBook.F_ID, testBook.getId()),
        QueryCondition.eq(TestBook.F_ACTIVATIONKEY, DEFAULT_ACTIVATIONKEY)
        );

        // Get all the testBookList where activationKey equals to UPDATED_ACTIVATIONKEY
        defaultTestBookShouldNotBeFound(QueryCondition.eq(TestBook.F_ID, testBook.getId()),
        QueryCondition.eq(TestBook.F_ACTIVATIONKEY, UPDATED_ACTIVATIONKEY)
        );
    }

    @Test
    @Transactional
    public void getAllTestBooksByActivationKeyIsInShouldWork() throws Exception {
        // Initialize the database
        testBookRepository.saveAndFlush(testBook);

        // Get all the testBookList where activationKey in DEFAULT_ACTIVATIONKEY or UPDATED_ACTIVATIONKEY
        defaultTestBookShouldBeFound(QueryCondition.eq(TestBook.F_ID, testBook.getId()),
         QueryCondition.in(TestBook.F_ACTIVATIONKEY, Lists.newArrayList(DEFAULT_ACTIVATIONKEY, DEFAULT_ACTIVATIONKEY))
        );

        // Get all the testBookList where activationKey equals to UPDATED_ACTIVATIONKEY
        defaultTestBookShouldNotBeFound(QueryCondition.eq(TestBook.F_ID, testBook.getId()),
         QueryCondition.in(TestBook.F_ACTIVATIONKEY, Lists.newArrayList(UPDATED_ACTIVATIONKEY))
        );
    }

    @Test
    @Transactional
    public void getAllTestBooksByActivationKeyIsNullOrNotNull() throws Exception {
        // Initialize the database
        testBookRepository.saveAndFlush(testBook);

        // Get all the testBookList where activationKey is not null
        defaultTestBookShouldBeFound(QueryCondition.eq(TestBook.F_ID, testBook.getId()), QueryCondition.isNotNull(TestBook.F_ACTIVATIONKEY));

        // Get all the testBookList where activationKey is null
        defaultTestBookShouldNotBeFound(QueryCondition.eq(TestBook.F_ID, testBook.getId()), QueryCondition.isNull(TestBook.F_ACTIVATIONKEY));
    }
    @Test
    @Transactional
    public void getAllTestBooksByResetKeyIsEqualToSomething() throws Exception {
        // Initialize the database
        testBookRepository.saveAndFlush(testBook);

        // Get all the testBookList where resetKey equals to DEFAULT_RESETKEY
        defaultTestBookShouldBeFound(QueryCondition.eq(TestBook.F_ID, testBook.getId()),
        QueryCondition.eq(TestBook.F_RESETKEY, DEFAULT_RESETKEY)
        );

        // Get all the testBookList where resetKey equals to UPDATED_RESETKEY
        defaultTestBookShouldNotBeFound(QueryCondition.eq(TestBook.F_ID, testBook.getId()),
        QueryCondition.eq(TestBook.F_RESETKEY, UPDATED_RESETKEY)
        );
    }

    @Test
    @Transactional
    public void getAllTestBooksByResetKeyIsInShouldWork() throws Exception {
        // Initialize the database
        testBookRepository.saveAndFlush(testBook);

        // Get all the testBookList where resetKey in DEFAULT_RESETKEY or UPDATED_RESETKEY
        defaultTestBookShouldBeFound(QueryCondition.eq(TestBook.F_ID, testBook.getId()),
         QueryCondition.in(TestBook.F_RESETKEY, Lists.newArrayList(DEFAULT_RESETKEY, DEFAULT_RESETKEY))
        );

        // Get all the testBookList where resetKey equals to UPDATED_RESETKEY
        defaultTestBookShouldNotBeFound(QueryCondition.eq(TestBook.F_ID, testBook.getId()),
         QueryCondition.in(TestBook.F_RESETKEY, Lists.newArrayList(UPDATED_RESETKEY))
        );
    }

    @Test
    @Transactional
    public void getAllTestBooksByResetKeyIsNullOrNotNull() throws Exception {
        // Initialize the database
        testBookRepository.saveAndFlush(testBook);

        // Get all the testBookList where resetKey is not null
        defaultTestBookShouldBeFound(QueryCondition.eq(TestBook.F_ID, testBook.getId()), QueryCondition.isNotNull(TestBook.F_RESETKEY));

        // Get all the testBookList where resetKey is null
        defaultTestBookShouldNotBeFound(QueryCondition.eq(TestBook.F_ID, testBook.getId()), QueryCondition.isNull(TestBook.F_RESETKEY));
    }
    @Test
    @Transactional
    public void getAllTestBooksByResetDateIsEqualToSomething() throws Exception {
        // Initialize the database
        testBookRepository.saveAndFlush(testBook);

        // Get all the testBookList where resetDate equals to DEFAULT_RESETDATE
        defaultTestBookShouldBeFound(QueryCondition.eq(TestBook.F_ID, testBook.getId()),
        new QueryCondition(TestBook.F_RESETDATE, QueryCondition.Operator.eq, PublicUtil.fmtDate(DEFAULT_RESETDATE), SystemConfig.TYPE_DATE)
);

        // Get all the testBookList where resetDate equals to UPDATED_RESETDATE
        defaultTestBookShouldNotBeFound(QueryCondition.eq(TestBook.F_ID, testBook.getId()),
        new QueryCondition(TestBook.F_RESETDATE, QueryCondition.Operator.eq, PublicUtil.fmtDate(UPDATED_RESETDATE), SystemConfig.TYPE_DATE)
);
    }

    @Test
    @Transactional
    public void getAllTestBooksByResetDateIsInShouldWork() throws Exception {
        // Initialize the database
        testBookRepository.saveAndFlush(testBook);

        // Get all the testBookList where resetDate in DEFAULT_RESETDATE or UPDATED_RESETDATE
        defaultTestBookShouldBeFound(QueryCondition.eq(TestBook.F_ID, testBook.getId()),
        new QueryCondition(TestBook.F_RESETDATE, QueryCondition.Operator.in, PublicUtil.fmtDate(DEFAULT_RESETDATE), SystemConfig.TYPE_DATE)
);

        // Get all the testBookList where resetDate equals to UPDATED_RESETDATE
        defaultTestBookShouldNotBeFound(QueryCondition.eq(TestBook.F_ID, testBook.getId()),
        new QueryCondition(TestBook.F_RESETDATE, QueryCondition.Operator.in, PublicUtil.fmtDate(UPDATED_RESETDATE), SystemConfig.TYPE_DATE)
);
    }

    @Test
    @Transactional
    public void getAllTestBooksByResetDateIsNullOrNotNull() throws Exception {
        // Initialize the database
        testBookRepository.saveAndFlush(testBook);

        // Get all the testBookList where resetDate is not null
        defaultTestBookShouldBeFound(QueryCondition.eq(TestBook.F_ID, testBook.getId()), QueryCondition.isNotNull(TestBook.F_RESETDATE));

        // Get all the testBookList where resetDate is null
        defaultTestBookShouldNotBeFound(QueryCondition.eq(TestBook.F_ID, testBook.getId()), QueryCondition.isNull(TestBook.F_RESETDATE));
    }
    @Test
    @Transactional
    public void getAllTestBooksByResetDateIsGreaterThanOrEqualToSomething() throws Exception {
        // Initialize the database
        testBookRepository.saveAndFlush(testBook);

        // Get all the testBookList where resetDate greater than or equals to DEFAULT_RESETDATE
        defaultTestBookShouldBeFound(QueryCondition.eq(TestBook.F_ID, testBook.getId()),
        new QueryCondition(TestBook.F_RESETDATE, QueryCondition.Operator.ge, PublicUtil.fmtDate(DEFAULT_RESETDATE), SystemConfig.TYPE_DATE)
);

        // Get all the testBookList where resetDate greater than or equals to UPDATED_RESETDATE
        defaultTestBookShouldNotBeFound(QueryCondition.eq(TestBook.F_ID, testBook.getId()),
        new QueryCondition(TestBook.F_RESETDATE, QueryCondition.Operator.ge, PublicUtil.fmtDate(UPDATED_RESETDATE), SystemConfig.TYPE_DATE)
);
    }

    @Test
    @Transactional
    public void getAllTestBooksByResetDateIsLessThanSomething() throws Exception {
        // Initialize the database
        testBookRepository.saveAndFlush(testBook);

        // Get all the testBookList where resetDate less than or equals to DEFAULT_SORT
        defaultTestBookShouldNotBeFound(QueryCondition.eq(TestBook.F_ID, testBook.getId()),
        new QueryCondition(TestBook.F_RESETDATE, QueryCondition.Operator.lt, PublicUtil.fmtDate(DEFAULT_RESETDATE), SystemConfig.TYPE_DATE)
);

        // Get all the testBookList where resetDate less than or equals to UPDATED_SORT
        defaultTestBookShouldBeFound(QueryCondition.eq(TestBook.F_ID, testBook.getId()),
        new QueryCondition(TestBook.F_RESETDATE, QueryCondition.Operator.lt, PublicUtil.fmtDate(UPDATED_RESETDATE), SystemConfig.TYPE_DATE)
);
    }
    @Test
    @Transactional
    public void getAllTestBooksByDescriptionIsEqualToSomething() throws Exception {
        // Initialize the database
        testBookRepository.saveAndFlush(testBook);

        // Get all the testBookList where description equals to DEFAULT_DESCRIPTION
        defaultTestBookShouldBeFound(QueryCondition.eq(TestBook.F_ID, testBook.getId()),
        QueryCondition.eq(TestBook.F_DESCRIPTION, DEFAULT_DESCRIPTION)
        );

        // Get all the testBookList where description equals to UPDATED_DESCRIPTION
        defaultTestBookShouldNotBeFound(QueryCondition.eq(TestBook.F_ID, testBook.getId()),
        QueryCondition.eq(TestBook.F_DESCRIPTION, UPDATED_DESCRIPTION)
        );
    }

    @Test
    @Transactional
    public void getAllTestBooksByDescriptionIsInShouldWork() throws Exception {
        // Initialize the database
        testBookRepository.saveAndFlush(testBook);

        // Get all the testBookList where description in DEFAULT_DESCRIPTION or UPDATED_DESCRIPTION
        defaultTestBookShouldBeFound(QueryCondition.eq(TestBook.F_ID, testBook.getId()),
         QueryCondition.in(TestBook.F_DESCRIPTION, Lists.newArrayList(DEFAULT_DESCRIPTION, DEFAULT_DESCRIPTION))
        );

        // Get all the testBookList where description equals to UPDATED_DESCRIPTION
        defaultTestBookShouldNotBeFound(QueryCondition.eq(TestBook.F_ID, testBook.getId()),
         QueryCondition.in(TestBook.F_DESCRIPTION, Lists.newArrayList(UPDATED_DESCRIPTION))
        );
    }

    @Test
    @Transactional
    public void getAllTestBooksByDescriptionIsNullOrNotNull() throws Exception {
        // Initialize the database
        testBookRepository.saveAndFlush(testBook);

        // Get all the testBookList where description is not null
        defaultTestBookShouldBeFound(QueryCondition.eq(TestBook.F_ID, testBook.getId()), QueryCondition.isNotNull(TestBook.F_DESCRIPTION));

        // Get all the testBookList where description is null
        defaultTestBookShouldNotBeFound(QueryCondition.eq(TestBook.F_ID, testBook.getId()), QueryCondition.isNull(TestBook.F_DESCRIPTION));
    }

    /**
     * Executes the search, and checks that the default entity is returned
     */
    private void defaultTestBookShouldBeFound(QueryCondition... queryCondition) throws Exception {
        restTestBookMockMvc.perform(get(DEFAULT_API_URL).param("queryConditionJson", Json.toJSONString(Lists.newArrayList(queryCondition))))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.data").isArray())
            .andExpect(jsonPath("$.data.[*].id").value(hasItem(testBook.getId())))
                .andExpect(jsonPath("$.data.[*].title").value(hasItem(DEFAULT_TITLE)))
                    .andExpect(jsonPath("$.data.[*].name").value(hasItem(DEFAULT_NAME)))
                .andExpect(jsonPath("$.data.[*].email").value(hasItem(DEFAULT_EMAIL)))
                .andExpect(jsonPath("$.data.[*].phone").value(hasItem(DEFAULT_PHONE)))
                    .andExpect(jsonPath("$.data.[*].langKey").value(hasItem(DEFAULT_LANGKEY)))
                .andExpect(jsonPath("$.data.[*].activationKey").value(hasItem(DEFAULT_ACTIVATIONKEY)))
                .andExpect(jsonPath("$.data.[*].resetKey").value(hasItem(DEFAULT_RESETKEY)))
                .andExpect(jsonPath("$.data.[*].resetDate").value(hasItem(PublicUtil.fmtDate(DEFAULT_RESETDATE))))
                                    .andExpect(jsonPath("$.data.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
        ;
    }

    /**
     * Executes the search, and checks that the default entity is not returned
     */
    private void defaultTestBookShouldNotBeFound(QueryCondition... queryCondition) throws Exception {
        restTestBookMockMvc.perform(get(DEFAULT_API_URL).param("queryConditionJson", Json.toJSONString(Lists.newArrayList(queryCondition))))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.data").isArray())
            .andExpect(jsonPath("$.data").isEmpty());
    }


    @Test
    @Transactional
    public void getNonExistingTestBook() throws Exception {
        // Get the testBook
        restTestBookMockMvc.perform(get(DEFAULT_API_URL+"{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateTestBook() throws Exception {
        // Initialize the database
        testBookService.save(testBook);

        int databaseSizeBeforeUpdate = testBookRepository.findAll().size();

        // Update the testBook
        TestBook updatedTestBook = testBookRepository.findOne(testBook.getId());
        // Disconnect from session so that the updates on updatedTestBook are not directly saved in db
        em.detach(updatedTestBook);
        Reflections.updateObj(updatedTestBook, Lists.newArrayList(
		 TestBook.F_TITLE
		,TestBook.F_AUTHOR
		,TestBook.F_NAME
		,TestBook.F_EMAIL
		,TestBook.F_PHONE
		,TestBook.F_ACTIVATED
		,TestBook.F_LANGKEY
		,TestBook.F_ACTIVATIONKEY
		,TestBook.F_RESETKEY
		,TestBook.F_RESETDATE
		,TestBook.F_DESCRIPTION
        ), 
	
		 UPDATED_TITLE
	
		,UPDATED_AUTHOR
	
		,UPDATED_NAME
	
		,UPDATED_EMAIL
	
		,UPDATED_PHONE
	
		,UPDATED_ACTIVATED
	
		,UPDATED_LANGKEY
	
		,UPDATED_ACTIVATIONKEY
	
		,UPDATED_RESETKEY
	
		,UPDATED_RESETDATE
	
	
	
	
	
	
		,UPDATED_DESCRIPTION
	
	);

        TestBookVo testBookVo = testBookService.copyBeanToVo(updatedTestBook);
        restTestBookMockMvc.perform(post(DEFAULT_API_URL)
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(testBookVo)))
            .andExpect(status().isOk());

        // Validate the TestBook in the database
        List<TestBook> testBookList = testBookRepository.findAll();
        assertThat(testBookList).hasSize(databaseSizeBeforeUpdate);

        TestBook testTestBook = testBookList.stream().filter(item->testBook.getId().equals(item.getId())).findAny().get();
		assertThat(testTestBook.getTitle()).isEqualTo(UPDATED_TITLE);
		assertThat(testTestBook.getAuthor()).isEqualTo(UPDATED_AUTHOR);
		assertThat(testTestBook.getName()).isEqualTo(UPDATED_NAME);
		assertThat(testTestBook.getEmail()).isEqualTo(UPDATED_EMAIL);
		assertThat(testTestBook.getPhone()).isEqualTo(UPDATED_PHONE);
		assertThat(testTestBook.getActivated()).isEqualTo(UPDATED_ACTIVATED);
		assertThat(testTestBook.getLangKey()).isEqualTo(UPDATED_LANGKEY);
		assertThat(testTestBook.getActivationKey()).isEqualTo(UPDATED_ACTIVATIONKEY);
		assertThat(testTestBook.getResetKey()).isEqualTo(UPDATED_RESETKEY);
		assertThat(testTestBook.getResetDate()).isEqualTo(UPDATED_RESETDATE);
		assertThat(testTestBook.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }


    @Test
    @Transactional
    public void deleteTestBook() throws Exception {
        // Initialize the database
        testBookService.save(testBook);
        SpecificationDetail<TestBook> spec = DynamicSpecifications.bySearchQueryCondition(
            QueryCondition.ne(BaseEntity.F_STATUS, BaseEntity.FLAG_DELETE));
        int databaseSizeBeforeDelete = testBookRepository.findAll(spec).size();

        // Get the testBook
        restTestBookMockMvc.perform(delete(DEFAULT_API_URL+"{id}", testBook.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<TestBook> testBookList = testBookRepository.findAll(spec);
        assertThat(testBookList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(TestBook.class);
        TestBook testBook1 = new TestBook();
        testBook1.setId("id1");
        TestBook testBook2 = new TestBook();
        testBook2.setId(testBook1.getId());
        assertThat(testBook1).isEqualTo(testBook2);
        testBook2.setId("id2");
        assertThat(testBook1).isNotEqualTo(testBook2);
        testBook1.setId(null);
        assertThat(testBook1).isNotEqualTo(testBook2);
    }

}