panel.plugin("baukasten-blocks-preview/preview", {
	blocks: {
		card: {
			data() {
				return {
					text: "No text value",
					hoverText: "No hover text value",
				};
			},
			computed: {
				heading() {
					const title = this.content.title || "Default Title";
					const textarea = document.createElement("textarea");
					textarea.innerHTML = title;
					return textarea.value;
				},
				image() {
					return this.content.image[0] || {};
				},
				hoverToggle() {
					return this.content.hoverToggle || false;
				},
			},
			watch: {
				page: {
					handler(value) {
						if (this.pageId) {
							this.$api
								.get("pages/" + this.pageId.replaceAll("/", "+"))
								.then((page) => {
									let processedText =
										page.content.text.replace(/(<([^>]+)>)/gi, "") || this.text;
									// Decode HTML entities in the text
									const textarea = document.createElement("textarea");
									textarea.innerHTML = processedText;
									this.text = textarea.value;
								});
						} else {
							let processedText = this.content.text || this.text;
							// Decode HTML entities in the text
							const textarea = document.createElement("textarea");
							textarea.innerHTML = processedText;
							this.text = textarea.value;
						}
					},
					immediate: true,
				},
				hoverToggle: {
					handler(value) {
						if (value) {
							this.hoverText = this.content.hovertext || this.hoverText;
						}
					},
					immediate: true,
				},
			},
			template: `
			  <div @dblclick="open" class="k-block-type-card">
			  <h2 class="k-block-type-card-heading">{{ heading }}</h2>
			  <div class="k-block-type-card-text">{{ text }}</div>
				<k-aspect-ratio
				  class="k-block-type-card-image"
				  cover="true"
				  ratio="1/1"
				>
				  <img
					v-if="image.url"
					:src="image.url"
					alt=""
					class="k-block-type-card-image-img"
				  >
				</k-aspect-ratio>
			  </div>
			`,
		},
		accordion: {
			computed: {
				items() {
					return this.content.acc || { marks: true };
				},
			},
			methods: {
				updateItem(content, index, fieldName, value) {
					content.acc[index][fieldName] = value;
					this.$emit("update", {
						...this.content,
						...content,
					});
				},
			},
			template: `
			  <div>
				<div v-if="items.length">
				  <details v-for="(item, index) in items" :key="index">
					<summary>
					  <k-writer
						ref="title"
						:inline="true"
						:marks="false"
						:value="item.title"
						@input="updateItem(content, index, 'title', $event)"
					  />
					</summary>
					<k-writer
					  class="label"
					  ref="text"
					  :nodes="true"
					  :marks="true"
					  :value="item.text"
					  @input="updateItem(content, index, 'text', $event)"
					/>
				  </details>
				</div>
				<div v-else>Noch keine Akkordeon Elemente vorhanden.</div>
			  </div>
			`,
		},
		quoteSlider: {
			computed: {
				items() {
					return this.content.acc || { marks: true };
				},
			},
			methods: {
				updateItem(content, index, fieldName, value) {
					content.acc[index][fieldName] = value;
					this.$emit("update", {
						...this.content,
						...content,
					});
				},
			},
			template: `
				<div>
					<div v-if="items.length">
						<div v-for="(item, index) in items" :key="index" class="quote-item">
							<k-writer
								class="label"
								ref="text"
								:nodes="false"
								:marks="false"
								:value="item.text"
								@input="updateItem(content, index, 'text', $event)"
							/>
							<k-writer
								ref="author"
								:inline="true"
								:marks="false"
								:value="item.author"
								class="author"
								@input="updateItem(content, index, 'author', $event)"
							/>
						</div>
					</div>
					<div v-else>Noch keine Zitate vorhanden.</div>
				</div>
			`,
		},

		iconlist: {
			computed: {
				items() {
					return this.content.list || { marks: true };
				},
			},
			methods: {
				updateItem(content, index, fieldName, value) {
					content.list[index][fieldName] = value;
					this.$emit("update", {
						...this.content,
						...content,
					});
				},
			},
			template: `
			  <div class="k-iconlist">
				<div v-if="items.length">
				  <details v-for="(item, index) in items" :key="index">
					<summary>
					  <k-writer
						ref="text"
						:inline="true"
						:nodes="false"
					  	:marks="false"
						:value="item.text"
						@input="updateItem(content, index, 'text', $event)"
					  />
					</summary>
				  </details>
				</div>
				<div v-else>Noch keine Icon Liste Elemente vorhanden.</div>
			  </div>
			`,
		},
		divider: `
			<div class="k-divider k-grid">
				<div class="k-column" data-width="1/4">
				<span>⬆️ 📱</span>
				<input type="number" :value="content.spacingmobiletop" :placeholder="0" @input="update({ spacingmobiletop: $event.target.value })">
				<span>px</span>
				</div>
				<div class="k-column" data-width="1/4">
				<span>⬇️ 📱</span>
				<input type="number" :value="content.spacingmobilebottom" :placeholder="0" @input="update({ spacingmobilebottom: $event.target.value })">
				<span>px</span>
				</div>
				<div class="k-column" data-width="1/4">
				<span>⬆️ 🖥️</span>
				<input type="number" :value="content.spacingdesktoptop" :placeholder="0" @input="update({ spacingdesktoptop: $event.target.value })">
				<span>px</span>
				</div>
				<div class="k-column" data-width="1/4">
				<span>⬇️ 🖥️</span>
				<input type="number" :value="content.spacingdesktopbottom" :placeholder="0" @input="update({ spacingdesktopbottom: $event.target.value })">
				<span>px</span>
				</div>
			</div>
    `,
		button: `
		<k-button class="linkButton" icon="url">Button</k-button>
  `,
	},
});
