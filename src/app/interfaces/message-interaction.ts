interface IsEdited {
    isEdited: boolean;
}

interface IsDeleted {
    isDeleted: boolean;
}

export interface MessageInteraction<Status extends keyof (IsDeleted & IsEdited)> {
    message: {
        id: string;
        text: string;
        status: Pick<IsDeleted & IsEdited, Status>;
    };
}
