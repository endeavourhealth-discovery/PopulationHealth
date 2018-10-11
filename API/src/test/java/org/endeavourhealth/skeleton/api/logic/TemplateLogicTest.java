package org.endeavourhealth.skeleton.api.logic;

import org.endeavourhealth.skeleton.api.dal.TemplateDAL_Mock;
import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.*;

public class TemplateLogicTest {
    private TemplateDAL_Mock dal;
    private TemplateLogic instance;

    @Before
    public void setup() {
        dal = new TemplateDAL_Mock();
        instance =  new TemplateLogic(dal);
    }

    @Test
    public void getMessage() {
        String actual = instance.getMessage("Fred");
        assertTrue("DAL not called", dal.getGreetingCalled);
        assertEquals("Malformed message ", "Hello mock Fred", actual);
    }
}