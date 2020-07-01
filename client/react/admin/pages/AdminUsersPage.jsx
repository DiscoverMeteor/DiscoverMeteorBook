AdminUsersPage = createReactClass({

  render() {

    var columns = ['createdAt', '_id', 'email', 'username', 'enrolled', 'purchases'];
    var columnMetadata = [
      {
        columnName: "createdAt",
        order: 1,
        displayName: "date",
        customComponent: CreatedAt
      },
      {
        columnName: "_id",
        order: 2,
        customComponent: UserId
      },
      {
        columnName: "username",
        order: 3,
        customComponent: Username
      },
      {
        columnName: "email",
        order: 4,
      },        
      {
        columnName: "enrolled",
        order: 5,
        customComponent: Enrolled
      },
      {
        columnName: "purchases",
        order: 6,
        customComponent: AdminUserPurchases
      }
    ];

    return (
      <AdminLayout>
        <MeteorGriddle
          publication="adminUsers"
          collection={Meteor.users}
          matchingResultsCount="matching-users"
          filteredFields={["email", "username", "emails.address", "services.meteor-developer.username"]}
          externalResultsPerPage={10}
          columns={columns}
          columnMetadata={columnMetadata}
          showFilter={true}
          useExternal={true}
          externalSortColumn="createdAt"
          externalSortAscending={false}
        />
      </AdminLayout>
    )

  }

});