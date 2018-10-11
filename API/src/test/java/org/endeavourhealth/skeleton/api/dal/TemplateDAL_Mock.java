package org.endeavourhealth.skeleton.api.dal;

public class TemplateDAL_Mock implements TemplateDAL {
    public boolean getGreetingCalled = false;
    @Override
    public String getGreeting() {
        this.getGreetingCalled = true;
        return "Hello mock";
    }
}
