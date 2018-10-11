package org.endeavourhealth.skeleton.api.metrics;

import com.codahale.metrics.MetricRegistry;
import com.codahale.metrics.servlets.MetricsServlet;

// TODO: Metrics listener
public class TemplateMetricListener extends MetricsServlet.ContextListener {
    public static final MetricRegistry templateMetricRegistry = TemplateInstrumentedFilterContextListener.REGISTRY;

    @Override
    protected MetricRegistry getMetricRegistry() {
        return templateMetricRegistry;
    }
}
