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


Useful info when changing or updating models and have to reset the database
mysql/heroku setup

mysql://xbtk63rcpfnw4hn1:orwxsft0xz4hdwnm@uzb4o9e2oe257glt.cbetxkdyhwsb.us-east-1.rds.amazonaws.com:3306/qnxd7slcsl9w57bp

USER: xbtk63rcpfnw4hn1

PASSWORD: orwxsft0xz4hdwnm

HOST: uzb4o9e2oe257glt.cbetxkdyhwsb.us-east-1.rds.amazonaws.com 

DATABASE: qnxd7slcsl9w57bp