require "time"
require "psych"
require "erb"

require "rubygems"
require "stringex"
require "redcarpet"


ROOT_URL = "http://blog.owo.tw/"


def create_public
  mkdir "public" unless File.directory?("public")
  %w(CNAME fonts images javascripts).each {|file| cp_r "#{file}", "public"}
end


def compass_compile
  system "compass compile"
end


def parse_post (filename) 
  metadata, markdown = File.read(filename).split("---", 2)
  metadata = Psych.parse(metadata).to_ruby
  markdown = Redcarpet::Markdown.new(Redcarpet::Render::HTML, :autolink => true, :space_after_headers => true).render(markdown)

  tags = metadata["tags"] ? metadata["tags"].split(/,\s*/).map {|tag| tag.downcase } : []
  url = "#{metadata["datetime"].strftime("%Y-%m-%d")}-#{metadata["title"].to_url}"

  return {
    :id => metadata["id"].to_i,
    :title => metadata["title"],
    :datetime => metadata["datetime"],
    :tags => tags,
    :url => url,
    :shortlink => "#{ROOT_URL}posts/#{metadata["id"]}",
    :permalink => "#{ROOT_URL}posts/#{metadata["id"]}/#{url}.html",
    :article => markdown
  }
end


def load_posts
  posts = Dir.glob("posts/*.markdown")
  posts.map! {|post| parse_post(post) }
  posts.sort! {|a,b| b[:datetime] <=> a[:datetime] }
end


def load_erbs
  erbs = {}
  [:header, :footer, :index, :post, :archives, :tag].each do |erb|
    erbs[erb] = ERB.new(File.read("erbs/#{erb.to_s}.html.erb"))
  end
  erbs
end


def bake_index (erbs, posts)
  content = [:header, :index, :footer].map {|erb| erbs[erb].result(binding) }.join
  filename = "public/index.html"
  File.open("#{filename}", "w") {|index| index.puts content }

  puts "Index page #{filename} generated"
end


def bake_posts (erbs, posts)
  mkdir "public/posts" unless File.directory? "public/posts"
  posts.each do |post|
    folder = "public/posts/#{post[:id]}"
    mkdir "#{folder}" unless File.directory? "#{folder}"

    content = [:header, :post, :footer].map {|erb| erbs[erb].result(binding) }.join

    filename = "#{folder}/index.html"
    File.open("#{filename}", "w") {|post_file| post_file.puts content }

    filename = "#{folder}/#{post[:url]}.html"
    File.open("#{filename}", "w") {|post_file| post_file.puts content }

    puts "Post page #{filename} generated"
  end
end


def bake_archives (erbs, posts)
  years = posts.map{|post| post[:datetime].year }.uniq.sort{|a,b| b <=> a }
  content = [:header, :archives, :footer].map {|erb| erbs[erb].result(binding) }.join

  filename = "public/archives.html"
  File.open("#{filename}", "w") {|archives| archives.puts content }

  puts "Archives #{filename} generated"
end


def bake_atom (all_posts)
  posts = all_posts[0...20]
  filename = "public/atom.xml"
  File.open("#{filename}", "w") do |atom|
    atom.puts ERB.new(File.read("erbs/atom.xml.erb")).result(binding)
  end

  puts "Posts feed #{filename} generated"
end


def bake_tags (erbs, posts)
  mkdir "public/tags" unless File.directory? "public/tags"
  tags = posts.map{|post| post[:tags]}.reduce(:+).uniq
  tags.each do |tag|
    folder = "public/tags/#{tag}"
    mkdir "#{folder}" unless File.directory? "#{folder}"

    tag_posts = posts.select {|post| post[:tags].include? tag }
    content = [:header, :tag, :footer].map {|erb| erbs[erb].result(binding) }.join

    filename = "#{folder}/index.html"
    File.open("#{filename}", "w") {|tag| tag.puts content }

    puts "Tag page #{filename} generated"
  end
end

# Rake tasks
# ==========

desc "Generate static public site"
task :generate do
  create_public
  compass_compile
  posts = load_posts
  erbs = load_erbs
  bake_index(erbs, posts)
  bake_posts(erbs, posts)
  bake_archives(erbs, posts)
  bake_atom(posts)
  bake_tags(erbs, posts)
end


desc "Create a new post"
task :new_post, :title do |t, args|
  mkdir "posts" unless File.directory? "posts"

  args.with_defaults(:title => "new-post")
  title = args.title

  id = (File.exists? ".post-id") ? File.read(".post-id").chomp.to_i : 1
  time = Time.now
  filename = "posts/#{id}-#{time.strftime("%Y-%m-%d")}.markdown"

  File.open("#{filename}", "w") do |post|
    post.puts "id: #{id}"
    post.puts "title: \"#{title.gsub(/&/, "&amp;")}\""
    post.puts "datetime: #{time.strftime("%Y-%m-%d %H:%M:%S %Z")}"
    post.puts "tags: "
    post.puts "---"
  end

  File.open(".post-id", "w") {|id_file| id_file.puts (id + 1) }
  puts "New post #{filename} created"
end
