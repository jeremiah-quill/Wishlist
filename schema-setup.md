Tables:
User
Group
Gift

Associations:
User.hasMany(Gift)
<!-- I believe we need the next 2 associations so we can easily get all users that belong to a group, and all groups that belong to a user -->
Group.belongsToMany(User, {through: User_Groups})
User.belongsToMany(Group, {through: User_Groups})

Properties:
User
ID (integer)
Email (string, validate if email)
Password (string)

Group
ID (integer)
Event_name (string)
Exchange_date (date)
Price_limit (decimal)

Gift
ID (integer)
Name (string)
Link (string, validate if url)
Price (decimal)
user_id (foreign key to associate with user id)
