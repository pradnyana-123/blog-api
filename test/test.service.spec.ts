import slugify from "slugify"

describe('testing', () => {
    it('should return a slug', () => {
        const slug = slugify("this is an example slug", { lower: true, strict: true})

        console.log(slug)
        expect(slug).toBeDefined()
    })
})