package com.dark_store.bukafresh_backend.model;

import java.util.Set;

public enum Role {

    USER(Set.of(
            Permission.USER_PROFILE_READ,
            Permission.USER_PROFILE_UPDATE
    )),

    ADMIN(Set.of(
            Permission.USER_PROFILE_READ,
            Permission.USER_PROFILE_UPDATE,
            Permission.ORDER_CREATE,
            Permission.ORDER_READ,
            Permission. ADMIN_VIEW_ALL
    ));

    private final Set<Permission> permissions;

    Role(Set<Permission> permissions) {
        this.permissions = permissions;
    }

    public Set<Permission> permissions() {
        return permissions;
    }
}

