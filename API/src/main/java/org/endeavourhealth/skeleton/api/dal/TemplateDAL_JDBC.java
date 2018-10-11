package org.endeavourhealth.skeleton.api.dal;

public class TemplateDAL_JDBC implements TemplateDAL {
    @Override
    public String getGreeting() {
        return "Hello";
    }
}
