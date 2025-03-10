BEGIN;

CREATE USER elca_read_only WITH PASSWORD 'password';

GRANT CONNECT ON DATABASE elca TO elca_read_only;

GRANT USAGE ON SCHEMA bnb TO elca_read_only;              
GRANT SELECT ON ALL TABLES IN SCHEMA bnb TO elca_read_only;

GRANT USAGE ON SCHEMA elca TO elca_read_only;             
GRANT SELECT ON ALL TABLES IN SCHEMA elca TO elca_read_only;

GRANT USAGE ON SCHEMA elca_cache TO elca_read_only;       
GRANT SELECT ON ALL TABLES IN SCHEMA elca_cache TO elca_read_only;

GRANT USAGE ON SCHEMA import_assistant TO elca_read_only; 
GRANT SELECT ON ALL TABLES IN SCHEMA import_assistant TO elca_read_only;

GRANT USAGE ON SCHEMA lcc TO elca_read_only;              
GRANT SELECT ON ALL TABLES IN SCHEMA lcc TO elca_read_only;

GRANT USAGE ON SCHEMA nawoh TO elca_read_only;            
GRANT SELECT ON ALL TABLES IN SCHEMA nawoh TO elca_read_only;

GRANT USAGE ON SCHEMA public TO elca_read_only;           
GRANT SELECT ON ALL TABLES IN SCHEMA public TO elca_read_only;

GRANT USAGE ON SCHEMA soda4lca TO elca_read_only;         
GRANT SELECT ON ALL TABLES IN SCHEMA soda4lca TO elca_read_only;

GRANT USAGE ON SCHEMA stlb TO elca_read_only;             
GRANT SELECT ON ALL TABLES IN SCHEMA stlb TO elca_read_only;

COMMIT;