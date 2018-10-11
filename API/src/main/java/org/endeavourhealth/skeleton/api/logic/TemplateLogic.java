package org.endeavourhealth.skeleton.api.logic;

import org.endeavourhealth.skeleton.api.dal.TemplateDAL;
import org.endeavourhealth.skeleton.api.dal.TemplateDAL_JDBC;

public class TemplateLogic {
    private TemplateDAL dal;

    public TemplateLogic() {
        this.dal = new TemplateDAL_JDBC();
    }

    public TemplateLogic(TemplateDAL dal) {
        this.dal = dal;
    }

    public String getMessage(String name) {
        return dal.getGreeting() + " " + name;
    }
}
