package org.endeavourhealth.skeleton.api.endpoints;
import com.codahale.metrics.annotation.Timed;
import io.astefanutti.metrics.aspectj.Metrics;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.endeavourhealth.skeleton.api.logic.TemplateLogic;

import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.SecurityContext;

@Path("/template")                                                                          // TODO: endpoint path
@Metrics(registry = "templateMetricRegistry")                                               // TODO: metrics registry
@Api(description = "Api for all calls relating to the template")                            // TODO: endpoint description
public class TemplateEndpoint {

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    @Timed(absolute = true, name="Template.TemplateEndpoint.Message.Get")                   // TODO: metrics name <application>.<endpoint>.<path>.<method>
    @Path("/message")
    @ApiOperation(value = "Returns a list of all concepts")                                 // TODO: operation description
    public Response get(@Context SecurityContext sc,
                        @ApiParam(value = "Mandatory name") @QueryParam("name") String name
    ) {
        System.out.println("Get Called");

        String result = new TemplateLogic().getMessage(name);

        return Response
            .ok(result)
            .build();
    }
}
