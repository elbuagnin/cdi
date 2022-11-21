import { CDIOptions } from "../../startup/CDIConfig.js";
import nlp from "compromise";

export default function tagCharName (doc) {
	const name = CDIOptions.name;
    const nameTag = {name: "Principal"}
    nlp.extend(
        {"words": nameTag}
    )
    doc.match(name).tag('Principal');
}
