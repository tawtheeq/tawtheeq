## Models
### mission [main_app]
- mission_name
- dateFrom
- dateTo
- main_category
- main_person
- sub_category
- location [Riyadh, outside Riyadh, outside Saudi Arabia]
- photographer_code_1
- photographer_code_2
- photographer_code_3
- photographer_code_4
- photographer_code_5
- num_photos default '0'
- num_vids default '0'
- description

### mission [archive_app]
- mission_name
- month
- year
- main_person
- main_category
- sub_category
- location [Riyadh, outside Riyadh, outside Saudi Arabia]
- photographer_code_1
- photographer_code_2
- photographer_code_3
- photographer_code_4
- photographer_code_5
- num_photos default '0'
- num_vids default '0'
- description


### users
- id
- username
- email
- password
- leaves

### employees
- id 'int' 
- name 'text'
- mobile 'text'
- delegationBalance 'int'
- leaves '[from: yyyy-mm-dd , to: yyyy-mm-dd]'


19/8/2025 - to do:
- docker pull postgres
- docker run postgres and specify ports.
- goose do employees migrations.
- sqlc do migrations.