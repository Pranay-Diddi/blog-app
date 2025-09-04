--
-- PostgreSQL database dump
--

-- Dumped from database version 15.4
-- Dumped by pg_dump version 15.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: post_likes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.post_likes (
    userid integer NOT NULL,
    postid integer NOT NULL
);


ALTER TABLE public.post_likes OWNER TO postgres;

--
-- Name: posts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.posts (
    id integer NOT NULL,
    username character varying(100) NOT NULL,
    title character varying(255) NOT NULL,
    description text NOT NULL,
    tags text[] DEFAULT '{}'::text[],
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    userid integer,
    reactions integer DEFAULT 0
);


ALTER TABLE public.posts OWNER TO postgres;

--
-- Name: posts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.posts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.posts_id_seq OWNER TO postgres;

--
-- Name: posts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.posts_id_seq OWNED BY public.posts.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(100) NOT NULL,
    useremail character varying(100) NOT NULL,
    password text NOT NULL,
    role character varying(10) DEFAULT 'user'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['user'::character varying, 'admin'::character varying])::text[])))
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: posts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts ALTER COLUMN id SET DEFAULT nextval('public.posts_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: post_likes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.post_likes (userid, postid) FROM stdin;
8	2
8	12
8	11
6	2
6	12
9	12
9	11
9	2
10	12
10	14
10	2
10	11
\.


--
-- Data for Name: posts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.posts (id, username, title, description, tags, created_at, userid, reactions) FROM stdin;
12	Sanju	Travelling	travelling is fun	{chill,travel,beach,emotion}	2025-07-27 15:31:52.043481	8	12
14	Mohith	CMR	mukesh	{chill,travel,beach}	2025-07-29 14:40:41.839855	9	1
2	Pranay	Learning	Learning is not so fun	{Learn,"Never give up","Do you untill you win"}	2025-07-25 13:38:41.759287	5	9
11	Sanju	Testing	tesing username and password	{chill,travel,beach,emotion}	2025-07-27 15:30:04.778964	8	9
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, useremail, password, role, created_at) FROM stdin;
6	Tester	tester1@gmail.com	$2b$10$vofkcZ9h7tMd37N7jBNZduvSA5F4B63DcI/OaLRDrnZUv.22esyTS	user	2025-07-26 22:36:20.604721
7	Tester2	tester2@gmail.com	$2b$10$VCirndNqG239.FwQbSDurel0lYcBwB5lCuyNXZ6WlI3D9fPVxphqC	user	2025-07-26 22:46:18.522867
8	Sanju	sanju@gmail.com	$2b$10$cjJMtC43kFuvo0UfJQQKJO2CatWTLcxoYWDrhQi/GG80iYBw452ye	user	2025-07-27 15:26:20.899412
5	Pranay	pranay@gmail.com	$2b$10$LreWSiOVlYhEb1SQF6uX0.abLKu9HZV6ijDiSyDOnJ4CyhwVcLmgG	admin	2025-07-26 22:35:05.077741
9	Mohith	mohith@gmail.com	$2b$10$ak5k9/qn3AYZrfTN3N38UuRsObL1hvXHb9N887.UOwOi1bX6kaHhO	user	2025-07-29 14:38:28.498405
10	Pranay	pranay@gmail	$2b$10$GDCj46.hxLVYhpcZ9SKT3ezIHaSjvaWnUJZtrJcFywjEbC343BN0q	user	2025-08-21 14:15:04.626964
\.


--
-- Name: posts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.posts_id_seq', 14, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 10, true);


--
-- Name: post_likes post_likes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post_likes
    ADD CONSTRAINT post_likes_pkey PRIMARY KEY (userid, postid);


--
-- Name: posts posts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_useremail_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_useremail_key UNIQUE (useremail);


--
-- Name: posts fk_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT fk_user FOREIGN KEY (userid) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: post_likes post_likes_postid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post_likes
    ADD CONSTRAINT post_likes_postid_fkey FOREIGN KEY (postid) REFERENCES public.posts(id);


--
-- Name: post_likes post_likes_userid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post_likes
    ADD CONSTRAINT post_likes_userid_fkey FOREIGN KEY (userid) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

