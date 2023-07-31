// 🐨 implement the action function here.
// 1. accept the request object
// 2. get the formData from the request
// 3. get the title, slug, and markdown from the formData
// 4. call the createPost function from your post.model.ts
// 5. redirect to "/posts/admin".

import { Form, useActionData } from "@remix-run/react";
import { json, redirect, type ActionArgs } from '@remix-run/server-runtime';
import invariant from "tiny-invariant";
import { createNewPost } from "~/models/post.server";

const inputClassName = `w-full rounded border border-gray-500 px-2 py-1 text-lg`;


export async function action({ request }: ActionArgs ) {
  const formData = await request.formData()

  const title = formData.get("title");
  const slug = formData.get("slug");
  const markdown = formData.get("markdown");

  const errors = {
    title: title ? null : "Title is required",
    slug: slug ? null : "Slug is required",
    markdown: markdown ? null : "Markdown is required",
  };

  const hasErrors = Object.values(errors).some((errorMessage) => errorMessage);
  if (hasErrors) {
    return json(errors);
  }

  invariant(typeof title === "string", "title must be a string");
  invariant(typeof slug === "string", "slug must be a string");
  invariant(typeof markdown === "string", "markdown must be a string");


  await createNewPost({ title, slug, markdown})
  return redirect(`/posts/admin`)
}

export default function NewPost() {
  const errors = useActionData<typeof action>()
  return (
    <Form method="post">
      <p>
        <label>
          Post Title:{" "}
          <input type="text" name="title" className={inputClassName} />
          {errors?.title ? <em className="text-red-600">{errors.title}</em> : null}
        </label>
      </p>
      <p>
        <label>
          Post Slug:{" "}
          <input type="text" name="slug" className={inputClassName} />
        </label>
      </p>
      <p>
        <label htmlFor="markdown">Markdown: </label>
        <br />
        <textarea
          id="markdown"
          rows={8}
          name="markdown"
          className={`${inputClassName} font-mono`}
        />
      </p>
      <p className="text-right">
        <button
          type="submit"
          className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400 disabled:bg-blue-300"
        >
          Create Post
        </button>
      </p>
      </Form>
  );
}
