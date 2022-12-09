import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { remark } from "remark";
import remarkHtml from "remark-html";

const postDirectory = path.join(process.cwd(), "posts");

export const getSortedPostData = () => {
  // posts 파일 이름을 잡아주기
  const fileNames = fs.readdirSync(postDirectory)
  // ['pre-rendering.me , ....]

  const allPostData = fileNames.map(fileName => {
    const id = fileName.replace(/\.md$/,"")

    const fullPath = path.join(postDirectory, fileName);

    const fileContents = fs.readFileSync(fullPath, "utf-8")

    const matterResult = matter(fileContents);

    return {
      id,
      ...matterResult.data as {date : string; title: string}
    }
  })

  // Sorting

  return allPostData.sort((a,b) => {
    if(a.date < b.date) {
      return 1
    }else {
      return -1
    }
  })
}

export const getAllPostIds = () => {
    const fileNames = fs.readdirSync(postDirectory);
    return fileNames.map(fileName => {
      return {
        params : {
          id : fileName.replace(/\.md$/, "")
        }
      }
    })
}

export const getPostData = async(id : string) => {
  const fullPath = path.join(postDirectory, `${id}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf-8')

  const matterResult = matter(fileContents)

  const processedContent = await remark().use(remarkHtml).process(matterResult.content)
  const contentHtml = processedContent.toString()

  return {
    id,
    contentHtml,
    ...(matterResult.data as {data: string; title : string})

  }
}