package com.campusdual.cd2024bfs2g1.model.core.dao;

import com.ontimize.jee.server.dao.common.ConfigurationFile;
import com.ontimize.jee.server.dao.jdbc.OntimizeJdbcDaoSupport;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Repository;

@Lazy
@Repository(value = "RouteDao")
@ConfigurationFile(
        configurationFile = "dao/RouteDao.xml",
        configurationFilePlaceholder = "dao/placeholders.properties")

public class RouteDao extends OntimizeJdbcDaoSupport {

    public static final String ATTR_ID = "route_id";
    public static final String ATTR_NAME = "name";
    public static final String ATTR_DESCRIPTION = "description";
    public static final String ATTR_ESTIMATED_DURATION = "estimated_duration";
    public static final String ATTR_DIFFICULTY = "difficulty";

}