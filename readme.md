### Runner

### Environment

Runner server uses Nodejs, MySQL and Redis for its working. MySQL is used to store data related to orders and users while Redis is used in Access Control Layer of server.

### Requirements

Runner is a projec to assist on road fleet of current on-demand applications. This aims to help food delivery, grocery delivery, house help and other similar companies. This helps keep track of orders at each step and hence post live updated to customers.

Project aims to address following requirements

1. Admin should be able to Add/Update/Delete task.
2. Task can include GPS Location, Product Images(aws-s3 for now) and other meta information.
3. A Task can be assigned to an available runner.
4. A runner should be able to login in system and hence mark himself available for tasks.
5. When a Task gets assigned to runner, he should be marked busy and hence not available for other tasks.
6. Ones assigned, runner has to accept the task.
7. When on the task, Runner needs to mark order as started(food picked up from restaurant).
8. Post completion, Task can be marked compete by runner along with some meta information if necessary.
9. System should update end user at each step of the process via sms/email/push notification as per need.

### Future Plans

1. Allow assigning multiple tasks to same runner.

### Project Status - Work resumed from Dec 14, 2015
