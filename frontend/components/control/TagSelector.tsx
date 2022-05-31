import type { FC } from "react";
import type { FieldProps } from "formik";
import type { Tag as TagType } from "types";
import { NewPost } from "types";
import { Tag } from "@chakra-ui/react";

interface Props extends FieldProps<NewPost> {
    tags: TagType[];
}

export const TagSelector: FC<Props> = ({ field, form, tags, ...props }) => {
    console.log(form.errors.tags);
    const { setFieldValue, values } = form;
    const formikTags: TagType[] = values.tags;

    const handleTagClick = (tag: TagType) => {
        if (formikTags.includes(tag)) {
            return setFieldValue(
                "tags",
                formikTags.filter((t) => t.id !== tag.id)
            );
        } else {
            if (formikTags.length < 4) {
                return setFieldValue("tags", [...formikTags, tag]);
            }
        }
    };

    const isActive = (id: TagType["id"]) => {
        return formikTags.find((t) => t.id === id) !== undefined;
    };

    return (
        <>
            {tags.map((tag, i) => (
                <Tag
                    key={i}
                    variant="subtle"
                    colorScheme={isActive(tag.id) ? "purple" : "blackAlpha"}
                    my="1"
                    cursor="pointer"
                    mx="1.5"
                    onClick={() => handleTagClick(tag)}
                    {...props}
                >
                    #{tag.name}
                </Tag>
            ))}
        </>
    );
};